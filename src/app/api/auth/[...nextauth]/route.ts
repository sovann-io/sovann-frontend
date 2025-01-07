import NextAuth, {DefaultSession} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {NextAuthOptions} from "next-auth";

interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

// Module augmentation for NextAuth to extend default types
declare module "next-auth" {
    interface Session {
        user: {
            accessToken?: string;
        } & DefaultSession["user"];
    }

    // Extend the User interface to include fields from AuthResponse and an id
    interface User extends AuthResponse {
        id: string;
    }
}
// Module augmentation for JWT to include custom fields
declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {label: "Username", type: "text", placeholder: "john_doe"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error('Please provide username and password');
                }

                const data = new URLSearchParams({
                    grant_type: 'password',
                    username: credentials.username,
                    password: credentials.password,
                    scope: '',
                    client_id: 'your_client_id', // Replace with your actual client ID
                    client_secret: 'your_client_secret', // Replace with your actual client secret
                });

                try {
                    const response = await fetch('http://localhost:8000/auth/jwt/login', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: data.toString(),
                    });

                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
                    }

                    const user: AuthResponse = await response.json();

                    // Important: NextAuth expects a user object with at least an 'id' property.
                    // Adapt this to your API response structure.
                    if (user && user.access_token) {
                        return {
                            id: credentials.username, ...user
                        }; // Successful authentication
                    } else {
                        return null; // Authentication failed
                    }
                } catch (error) {
                    console.error("Authentication error", error);
                    throw new Error("Authentication failed. Please check your credentials."); // Re-throw for NextAuth to handle
                }
            },
        }),
    ],
    // Configure to use JWT so we can store the token in the session
    session: {
        strategy: "jwt",
    },
    // Add your own secret (must be set in production via environment variables)
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        /**
         * When a user signs in, NextAuth will create a JWT.
         * We can persist the accessToken from the FastAPI response in the token object
         */
        async jwt({token, user}) {
            if (user?.access_token) {
                token.accessToken = user.access_token;
            }
            return token;
        },
        /**
         * This callback makes the token accessible via the session.
         */
        async session({session, token}) {
            if (token?.accessToken) {
                session.user = session.user || {};
                session.user.accessToken = token.accessToken;
            }
            return session;
        },
    }
};

/**
 * NextAuth in App Router needs to export the route handlers:
 * - GET for fetching session
 * - POST for sign-in
 */
const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};
