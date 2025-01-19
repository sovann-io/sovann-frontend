"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { RepoItem } from "@/types/repo-item";
import { applicationFormSchema, ApplicationFormValues } from "@/types/schemas/application-schemas";
import { CalendarDays, Database, FolderKanban, LayoutTemplate, PlusIcon, Share2Icon, SquareStack } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import DashboardPage from "@/app/dashboard/page";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import ProjectServiceTable from "@/components/project-overview/project-service-table";
import { getApplicationListService } from "@/services/application-service";
import { ApplicationItem } from "@/types/application-item";
import Link from "next/link";
import { addNewItems } from "@/constants/add-new";

const generateScheduledDeployAt = (): string => {
    const now = new Date();
    const extraSeconds = 30 * 1000;
    const futureDate = new Date(now.getTime() + (7 * 60 * 60 * 1000) + extraSeconds); // Add +7 hours
    const theFuture = futureDate.toISOString().slice(0, 19);
    console.log(theFuture)
    return theFuture;
};

export default function ProjectOverviewPage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [appList, setAppList] = useState<ApplicationItem[]>([]);
    const [repos, setRepos] = useState<RepoItem[]>([]);
    const { accessToken } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ApplicationFormValues>({
        resolver: zodResolver(applicationFormSchema),
    });

    useEffect(() => {
        async function getApplicationList() {
            setLoading(true);
            try {
                const response = await getApplicationListService()
                if (response.success === true) {
                    const appItems: ApplicationItem[] = []
                    response.data.forEach((app: ApplicationItem) => {
                        appItems.push(app)
                    })
                    setAppList(appItems)
                    console.log(appItems)
                }
            } catch (error) {
                if ((error as any).status === 401) {
                    toast.error("You need to be logged in to view this page");
                }
            }
            setLoading(false);
        }
        getApplicationList();
    }, []);

    const onSubmit: SubmitHandler<ApplicationFormValues> = async (data) => {
        if (!accessToken) {
            toast.error("You need to be logged in to submit the form");
            return;
        }
        try {

        } catch (error) {
            console.error("Error submitting form", error);
        }
    };

    return (
        <DashboardPage>
            <div className="grid space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl">Project Overview</h1>
                    <div className="flex items-center gap-3">
                        <HoverCard>
                            <HoverCardTrigger asChild>
                                <Button variant="link">
                                    <Share2Icon />
                                    Invite your team
                                </Button>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80">
                                <div className="flex justify-between space-x-4">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/vercel.png" />
                                        <AvatarFallback>VC</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-semibold">@nextjs</h4>
                                        <p className="text-sm">
                                            The React Framework - created and maintained by @vercel.
                                        </p>
                                        <div className="flex items-center pt-2">
                                            <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
                                            <span className="text-xs text-muted-foreground">
                                                Joined December 2021
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="py-5">
                                    <PlusIcon />
                                    Add New
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-44">
                                <DropdownMenuGroup>
                                    {addNewItems.slice(0, 1).map((item, index) => (
                                        <DropdownMenuItem key={index}>
                                            {item.icon}
                                            <Link href={item.href} className="mx-4">
                                                {item.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {addNewItems.slice(1).map((item, index) => (
                                        <DropdownMenuItem key={index + 1}>
                                            {item.icon}
                                            <Link href={item.href} className="mx-4">
                                                {item.label}
                                            </Link>
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <div>
                    <ProjectServiceTable
                        data={appList}
                        loading={loading}
                    />
                </div>
            </div>
        </DashboardPage>
    );
}
