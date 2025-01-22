"use client"

import DashboardPage from "@/app/dashboard/page";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACCESS_TOKEN, API_BASE_URL } from "@/constants/auth";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { RepositoryItem } from "@/types/repository-item";
import { ApplicationFormValues } from "@/types/schemas/application-schemas";
import { generateScheduledDeployAt } from "@/utils/datetime";
import axios from "axios";
import localforage from "localforage";
import { Check, ChevronsUpDown, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

export default function StaticPage() {
    const { accessToken, user } = useAuth();
    const [publicRepo, setPublicRepo] = useState<string>()
    const [repoListOpen, setRepoListOpen] = useState(false)
    const [branches, setBranches] = useState<string[]>([])
    const [strategy, setStrategy] = useState("docker");
    const [repositoryUrl, setRepositoryUrl] = useState<string>("")
    const [repositories, setRepositories] = useState<RepositoryItem[]>([])

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<ApplicationFormValues>({
        defaultValues: {
            app_name: '',
            project_id: '5d3c9116-d86a-481e-95b3-2739d3c0b512',
            description: '1',
            deployed_version: 'testing',
            not_expose_as_web_app: false,
            has_persistent_data: false,
            has_default_subdomain_ssl: false,
            force_ssl: false,
            websocket_support: false,
            instance_count: 0,
            pre_deploy_function: '1',
            custom_nginx_config: '1',
            redirect_domain: '1',
            app_deploy_token_enabled: false,
            app_deploy_token: '1',
            is_app_building: false,
            is_instant_deploy: true,
            scheduled_deploy_at: new Date().toISOString(),
            http_auth_user: '1',
            http_auth_password: '1',
            dockerfile_content: '1',
            dockercompose_content: '1',
            status: 'PENDING',
            networks: [],
            repo: null,
            container_command: '',
            env_vars: [],
            volumes: [],
            ports: [],
            options: [
                { key: 'service_type', value: `app_static` },
            ],
        }
    })

    useEffect(() => {
        // Fetch repositories
        async function fetchRepositories() {
            localforage.getItem(ACCESS_TOKEN).then(async (accessToken) => {
                const response = await axios.get(`${API_BASE_URL}/repos/github/list`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                console.log(response)
                if (response.status === 200) {
                    setRepositories(response.data)
                } else if (response.status === 401) {
                    toast.error("You are not authorized to view this page. Please login.")
                }
            })
        }
        fetchRepositories()
    }, [])

    const handleOnChangeRepository = async (currentValue: string) => {
        try {
            const repo = repositories.find((repo) => repo.repo_url === currentValue)
            if (!repo) {
                return
            }
            setValue('repo', {
                repo_url: repo.repo_url,
                branch: null,
                username: repo.username,
                password: null,
                ssh_key: null,
                provider: "github",
            })
            setRepoListOpen(false)
            setRepositoryUrl(currentValue === repositoryUrl ? "" : currentValue)
            localforage.getItem(ACCESS_TOKEN).then(async (accessToken) => {
                const response = await axios.get(`${API_BASE_URL}/repos/github/${repo.username}/${repo.name}/branches`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                if (response.status === 200) {
                    setBranches(response.data.map((branch: any) => branch.name))
                } else if (response.status === 401) {
                    toast.error("You are not authorized to view this page. Please login.")
                }
            })
        } catch (error) {
            console.error("Error selecting repository:", error)
        }
    }

    const onSubmit = async (data: any) => {
        console.log(data)
        if (!accessToken || !user) {
            toast.error('You need to be logged in to submit the form');
            return;
        }

        data.scheduled_deploy_at = true
            ? data.scheduled_deploy_at.slice(0, 19)
            : generateScheduledDeployAt();

        try {
            const response = await axios.post(
                `${API_BASE_URL}/applications/actual-create`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            toast.success('Static site created successfully!');
        } catch (error) {
            console.error('Error submitting form', error);
            toast.error('Error creating database');
        }
    }

    return (
        <DashboardPage groups={[]} showBackButton={true}>
            <div className="grid space-y-6">
                <div className="flex justify-between items-center py-1">
                    <h1 className="text-2xl">You are deploying a static site</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-8 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
                            <Label className="text-base font-medium text-gray-900 dark:text-gray-300">
                                Source Code
                            </Label>
                            <div className="col-span-1 sm:col-span-3">
                                <Tabs defaultValue="provider">
                                    <TabsList className="flex justify-evenly space-x-4">
                                        <TabsTrigger className="w-full" value="provider">Git Provider</TabsTrigger>
                                        <TabsTrigger className="w-full" value="public">Public Git Repository</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="provider">
                                        <Popover open={repoListOpen} onOpenChange={setRepoListOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={repoListOpen}
                                                    className="w-[500px] justify-between"
                                                >
                                                    {repositoryUrl
                                                        ? repositories.find((repo) => repo.repo_url === repositoryUrl)?.name
                                                        : "Select framework..."}
                                                    <ChevronsUpDown className="opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[500px] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search framework..." />
                                                    <CommandList>
                                                        <CommandEmpty>No framework found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {repositories?.map((repo) => (
                                                                <CommandItem
                                                                    key={repo.repo_url}
                                                                    value={repo.repo_url}
                                                                    onSelect={handleOnChangeRepository}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        {repo.username} <span>/</span> {!repo.private && <Lock />} {repo.private} {repo.name}
                                                                        <a target="_blank" href={repo.repo_url}>
                                                                            View
                                                                        </a>
                                                                    </div>
                                                                    <Check
                                                                        className={cn(
                                                                            "ml-auto",
                                                                            repositoryUrl === repo.repo_url ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </TabsContent>
                                    <TabsContent value="public">
                                        <Input
                                            type="text"
                                            placeholder="Repository URL"
                                            onChange={(e) => setPublicRepo(e.target.value)}
                                        />
                                        {/* {errors.repository_url && (
                                            <span className="text-red-500">This field is required</span>
                                        )} */}
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                        <div className="space-y-8">
                            <FormRow
                                label="App Name"
                                description="A unique name for your static site."
                            >
                                <Input
                                    placeholder="Name"
                                    className="px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    {...register('app_name')}
                                />
                            </FormRow>

                            <FormRow
                                label="Project"
                                description="Add this static site to a project once it's created."
                                optional
                            >
                                <Input
                                    placeholder="Project ID"
                                    className="px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    {...register('project_id')}
                                />
                            </FormRow>

                            <FormRow
                                label="Branch"
                                description="The Git branch to build and deploy."
                            >
                                <Select onValueChange={(value) => setValue('repo.branch', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {branches.length === 0 && (
                                                <SelectItem value="main">
                                                    main
                                                </SelectItem>
                                            )}
                                            {branches.map((branch, index) => (
                                                <SelectItem key={index} value={branch}>
                                                    {branch}
                                                </SelectItem>
                                            ))}
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
                        <div className="flex items-center gap-6">
                            <Button type="submit" className="px-8 h-full">
                                Create Static Site
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardPage>
    );
}