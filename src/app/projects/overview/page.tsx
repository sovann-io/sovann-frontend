"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { API_BASE_URL } from "@/constants/auth";
import { useAuth } from "@/hooks/use-auth";
import { RepoItem } from "@/types/repo-item";
import { applicationFormSchema, ApplicationFormValues } from "@/types/schemas/application-schemas";
import axios from "axios";
import { Database, FolderKanban, LayoutTemplate, Plus, PlusIcon, Projector, SquareStack, User } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { toast } from "sonner";

export default function ProjectOverviewPage() {
    const [repos, setRepos] = useState<RepoItem[]>([]);
    const { accessToken } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ApplicationFormValues>({
        resolver: zodResolver(applicationFormSchema),
        defaultValues: {
            app_name: "mysql" + Math.random().toString(36).substring(7),
            project_id: "a626e167-45ce-41e5-840d-c8b8db65f9bc",
            node_id: "a626e167-45ce-41e5-840d-c8b8db65f9bc",
            description: "",
            deployed_version: 1,
            not_expose_as_web_app: false,
            has_persistent_data: false,
            has_default_subdomain_ssl: false,
            force_ssl: false,
            websocket_support: false,
            instance_count: 0,
            pre_deploy_function: "",
            custom_nginx_config: "",
            redirect_domain: "",
            app_deploy_token_enabled: false,
            app_deploy_token: "",
            is_app_building: false,
            is_instant_building: true,
            http_auth_user: "",
            http_auth_password: "",
            dockerfile_content: "",
            dockercompose_content: "",
            status: "draft",
            networks: [],
            repo: {
                repo_url: "https://github.com/sovann-io/example-react-vite.git",
                branch: "main",
                username: null,
                password: null,
                ssh_key: null,
                provider: "github"
            },
            command: null,
            env_vars: [
                { key: "MYSQL_DATABASE", value: "db", is_secret: false },
                { key: "MYSQL_USER", value: "user", is_secret: false },
                { key: "MYSQL_PASSWORD", value: "password", is_secret: true },
                { key: "MYSQL_ROOT_PASSWORD", value: "password", is_secret: true },
            ],
            volumes: [],
            ports: [
                // {
                //     container_port: 3306,
                //     host_port: 3306,
                //     protocol: "tcp",
                //     publish_mode: "string",
                // },
            ],
            options: [
                // { key: "service_type", value: "db_mysql" },
                // { key: "tag", value: "8" },
            ],
        },
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/repos/github/list`, {
                    headers: {
                        Authorization: "Bearer " + accessToken
                    }
                });
                if (response.data) {
                    setRepos(response.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        if (accessToken) {
            fetchData();
        }
    }, [accessToken]);

    const [logs, setLogs] = useState<string[]>([]);

    const onSubmit: SubmitHandler<ApplicationFormValues> = async (data) => {
        if (!accessToken) {
            toast.error("You need to be logged in to submit the form");
            return;
        }
        try {
            const response = await axios.post(
                `${API_BASE_URL}/api/v1/applications/actual-create`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            "Bearer " + accessToken,
                    },
                }
            );
            console.log("Response: ", response.data);
            toast.success("Application created successfully");
            if (response.data?.success) {
                const appId = response.data?.data?.id;
                console.log("App ID: ", appId);
                if (appId) {
                    console.log("WebSocket connection established");

                    const ws = new WebSocket(`ws://localhost:8000/ws/logs/${appId}`);
                    console.log(`ws://localhost:8000/ws/logs/${appId}`)
                    ws.onmessage = (event) => {
                        console.log("WebSocket message received: ", event.data);
                        const message = JSON.parse(event.data);
                        console.log("Message: ", message);
                        setLogs((prevLogs) => [...prevLogs, message.data.message]);
                    };

                    ws.onerror = (error) => {
                        console.error("WebSocket error: ", error);
                    };

                    ws.onclose = () => {
                        console.log("WebSocket connection closed");
                    };
                }
            }
        } catch (error) {
            console.error("Error submitting form", error);
        }
    };

    return (
        <div className="grid grid-cols-2">
            <div>
                <h1>Project Overview</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>
                            <PlusIcon />
                            Add New
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-44">
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <FolderKanban />
                                <span className="mx-4">Projects</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>
                                <LayoutTemplate />
                                <span className="mx-4">Static</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Database />
                                <span className="mx-4">MySQL</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <SquareStack />
                                <span className="mx-4">Redis</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                {/* <RadioGroup defaultValue="comfortable">
                {repos.length === 0 && <p className='text-red-500'>No repositories found</p>}
                {repos.map((repo) => (
                    <div key={repo.url} className="flex items-center space-x-2">
                        <RadioGroupItem value={repo.url} id={repo.url} />
                        <Label htmlFor={repo.url}>{repo.name}</Label>
                    </div>
                ))}
            </RadioGroup> */}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Button type="submit">Submit</Button>
                    <Button type="button" onClick={
                        () => {
                            console.log("Redeploying")
                            axios.post(
                                `${API_BASE_URL}/api/v1/applications/04fe88da-2698-4ff4-a0bf-7f6fbb14a4b1/redeploy`,
                                null,
                                {
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization:
                                            "Bearer " + accessToken,
                                    },
                                }
                            ).then((response) => {
                                console.log("Response: ", response.data);
                                const ws = new WebSocket(`ws://localhost:8000/ws/logs/04fe88da-2698-4ff4-a0bf-7f6fbb14a4b1`);
                                ws.onmessage = (event) => {
                                    console.log("Redeploy WebSocket message received: ", event.data);
                                    const message = JSON.parse(event.data);
                                    setLogs((prevLogs) => [...prevLogs, message.data.message]);
                                };
                            }).catch((error) => {
                                console.error("Error redeploying application", error);
                            });
                        }
                    }>Redeploy</Button>
                    <div>
                        <label>App Name</label>
                        <Input {...register("app_name")} placeholder="Enter app name" />
                        {errors.app_name && <p className='text-red-500'>{errors.app_name.message}</p>}
                    </div>
                    <div>
                        <label>Project ID</label>
                        <Input {...register("project_id")} placeholder="Enter project ID" />
                        {errors.project_id && <p className='text-red-500'>{errors.project_id.message}</p>}
                    </div>
                    <div>
                        <label>Node ID</label>
                        <Input {...register("node_id")} placeholder="Enter node ID" />
                        {errors.node_id && <p className='text-red-500'>{errors.node_id.message}</p>}
                    </div>
                    <div>
                        <label>Description</label>
                        <Input {...register("description")} placeholder="Enter description" />
                        {errors.description && <p className='text-red-500'>{errors.description.message}</p>}
                    </div>
                    <div>
                        <label>Deployed Version</label>
                        <Input type="number" {...register("deployed_version")} placeholder="Enter deployed version" />
                        {errors.deployed_version && <p className='text-red-500'>{errors.deployed_version.message}</p>}
                    </div>
                    <div>
                        <label>Instance Count</label>
                        <Input type="number" {...register("instance_count")} placeholder="Enter instance count" />
                        {errors.instance_count && <p className='text-red-500'>{errors.instance_count.message}</p>}
                    </div>
                    <div>
                        <label>Not Expose as Web App</label>
                        <Input type="checkbox" {...register("not_expose_as_web_app")} />
                    </div>
                    <div>
                        <label>Has Persistent Data</label>
                        <Input type="checkbox" {...register("has_persistent_data")} />
                    </div>
                    <div>
                        <label>Force SSL</label>
                        <Input type="checkbox" {...register("force_ssl")} />
                    </div>
                    <div>
                        <label>Websocket Support</label>
                        <Input type="checkbox" {...register("websocket_support")} />
                    </div>
                </form>
            </div>
            <div>
                <h1>Project Logs</h1>
                <div>
                    {logs.map((log, index) => (
                        <p key={index}>{log}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}
