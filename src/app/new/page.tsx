"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { EventStreamContentType, fetchEventSource } from "@/lib/sse";

interface FormRowProps {
    label: string;
    description?: string;
    optional?: boolean;
    children: React.ReactNode;
}

const FormRow = ({ label, description, optional, children }: FormRowProps) => (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
        <div>
            <Label className="flex items-center gap-3 text-base font-medium text-gray-900 dark:text-gray-300">
                {label} {optional && <small className="text-xs">Optional</small>}
            </Label>
            {description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
            )}
        </div>
        <div className="col-span-1 sm:col-span-3">{children}</div>
    </div>
);

class RetriableError extends Error { }
class FatalError extends Error { }

export default function NewPage() {
    const [strategy, setStrategy] = useState("docker");

    useEffect(() => {
        async function fetchStreamLogs() {
            fetchEventSource('/api/sse', {
                async onopen(response) {
                    if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
                        return; // everything's good
                    } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                        // client-side errors are usually non-retriable:
                        throw new FatalError();
                    } else {
                        throw new RetriableError();
                    }
                },
                onmessage(msg) {
                    // if the server emits an error message, throw an exception
                    // so it gets handled by the onerror callback below:
                    if (msg.event === 'FatalError') {
                        throw new FatalError(msg.data);
                    }
                },
                onclose() {
                    // if the server closes the connection unexpectedly, retry:
                    throw new RetriableError();
                },
                onerror(err) {
                    if (err instanceof FatalError) {
                        throw err; // rethrow to stop the operation
                    } else {
                        // do nothing to automatically retry. You can also
                        // return a specific retry interval here.
                    }
                }
            });
        }
    }, []);

    return (
        <div className="space-y-8">
            <FormRow
                label="App Name"
                description="A unique name for your static site."
            >
                <Input
                    placeholder="Name"
                    className="px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </FormRow>

            <FormRow
                label="Project"
                description="Add this static site to a project once it's created."
                optional
            >
                <Input
                    placeholder="Name"
                    className="px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </FormRow>

            <FormRow
                label="Branch"
                description="The Git branch to build and deploy."
            >
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a branch" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="main">Main</SelectItem>
                            <SelectItem value="develop">Develop</SelectItem>
                            <SelectItem value="feature">Feature</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </FormRow>

            <FormRow
                label="Deployment Strategy"
                description="The deployment strategy to use."
            >
                <Select defaultValue="docker" onValueChange={setStrategy}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a strategy" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="docker">Docker</SelectItem>
                            <SelectItem value="swarm">Docker Swarm</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </FormRow>

            {strategy === "docker" && (
                <FormRow
                    label="Dockerfile Directory"
                    description="The directory containing the Dockerfile."
                    optional
                >
                    <Input
                        placeholder="Directory"
                        className="px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </FormRow>
            )}

            {strategy === "swarm" && (
                <>
                    <FormRow
                        label="Docker Swarm Stack Name"
                        description="The name of the Docker Swarm stack."
                        optional
                    >
                        <Input
                            placeholder="Stack Name"
                            className="px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </FormRow>
                    <FormRow
                        label="Swarm Configuration"
                        description="Additional configuration for Docker Swarm."
                        optional
                    >
                        <Input
                            placeholder="Configuration"
                            className="px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </FormRow>
                </>
            )}
        </div>
    );
}
