"use client"

import DashboardPage from "@/app/dashboard/page";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACCESS_TOKEN, API_BASE_URL } from "@/constants/auth";
import { cn } from "@/lib/utils";
import { Repository } from "@/types/repository-item";
import axios from "axios";
import localforage from "localforage";
import { Check, ChevronsUpDown, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function StaticPage() {
    const [open, setOpen] = useState(false)
    const [repositoryUrl, setRepositoryUrl] = useState<string>("")
    const [repositories, setRepositories] = useState<Repository[]>([])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data: any) => {
        console.log(data)
    }

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

    return (
        <DashboardPage groups={[]} showBackButton={true}>
            <div className="grid space-y-6">
                <div className="flex justify-between items-center py-1">
                    <h1 className="text-2xl">You are deploying a static site</h1>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-8 space-y-4">
                    </div>
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
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-[500px] justify-between"
                                            >
                                                {repositoryUrl
                                                    ? repositories.find((repo) => repo.url === repositoryUrl)?.name
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
                                                                key={repo.url}
                                                                value={repo.url}
                                                                onSelect={(currentValue) => {
                                                                    setRepositoryUrl(currentValue === repositoryUrl ? "" : currentValue)
                                                                    setOpen(false)
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    {repo.username} <span>/</span> {!repo.private && <Lock />} {repo.private} {repo.name} 
                                                                    <a target="_blank" href={repo.url}>
                                                                        View
                                                                    </a>
                                                                </div>
                                                                <Check
                                                                    className={cn(
                                                                        "ml-auto",
                                                                        repositoryUrl === repo.url ? "opacity-100" : "opacity-0"
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
                                        {...register("repository_url", { required: true })}
                                    />
                                    {errors.repository_url && (
                                        <span className="text-red-500">This field is required</span>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </form>
            </div>
        </DashboardPage>
    );
}