import NextAuth, {DefaultSession} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {NextAuthOptions} from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

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
            async authorize(credentials: any) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error('Please provide username and password');
                }

                const data = new URLSearchParams({
                    grant_type: 'password',
                    username: credentials.username,
                    password: credentials.password,
                    scope: '',
                    client_id: 'your_client_id',
                    client_secret: 'your_client_secret',
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

                    if (user && user.access_token) {
                        return {
                            id: credentials.username, ...user
                        };
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error("Authentication error", error);
                    throw new Error("Authentication failed. Please check your credentials."); // Re-throw for NextAuth to handle
                }
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({token, user, account}: any) {
            // Handle CredentialsProvider
            if (account?.provider === 'credentials' && user?.access_token) {
                token.accessToken = user.access_token; // Use `access_token` for credentials
            }
            // Handle other providers (e.g., GitHub)
            else if (account?.provider && account.provider !== 'credentials') {
                token.accessToken = account.access_token || token.accessToken; // Use access_token if provided
            }
            token.provider = account?.provider || token.provider; // Track provider type
            return token;
        },
        async session({session, token}: any) {
            if (token?.accessToken) {
                session.user = session.user || {};
                session.user.accessToken = token.accessToken;
            }
            return session;
        },
        async redirect({url, baseUrl}) {
            return baseUrl;
        },
    }
};

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};
