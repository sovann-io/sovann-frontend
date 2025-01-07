import {SailboatIcon} from "lucide-react";
import {RegistrationForm} from "@/app/register/components/registration-form";

export default function RegistrationPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {/* Left Side */}
            <div className="flex flex-col gap-4 p-6 md:p-10">
                {/* Logo + Title */}
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="/" className="flex items-center gap-2 font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <SailboatIcon className="h-4 w-4" />
                        </div>
                        Sovann.
                    </a>
                </div>

                {/* Form Container */}
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <RegistrationForm />
                    </div>
                </div>
            </div>

            {/* Right Side (Illustration / Image) */}
            <div
                className="relative hidden bg-muted lg:block bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(/images/undraw_ordinary-day_ak4e.svg)`,
                    backgroundSize: "80%",
                }}
            />
        </div>
    )
}