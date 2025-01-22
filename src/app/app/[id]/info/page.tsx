"use client"

import DashboardPage from "@/app/dashboard/page";
import CopyToClipboard from "@/components/shared/copy-to-clipboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PopoverTrigger } from "@/components/ui/popover";
import { editAppNameById, getApplicationDetailById } from "@/services/application-service";
import { ApplicationItem } from "@/types/application-item";
import { Pause, Play, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moment from 'moment';
import { getMappingEnvVar, getMappingOption } from "@/constants/misc";
import PasswordField from "@/components/shared/password-field";
import { EnvVarItem, OptionItem, PortItem } from "@/types/sub-app-item";
import { toast } from "sonner";
import { appStaticNavGroups, dynamicNavGroups } from "@/constants/sidebar";
import { displayAppStatus } from "@/lib/project-utils";
import { getRepositoryByAppId } from "@/services/repo-service";
import { RepositoryItem } from "@/types/repository-item";
import { ACCESS_TOKEN, API_BASE_URL } from "@/constants/auth";
import { Textarea } from "@/components/ui/textarea";
import localforage from "localforage";
import { useAuth } from "@/hooks/use-auth";

const AppServiceDetailPage = () => {
    // Get the data from the URL
    const pathname = usePathname()
    const router = useRouter()

    const { accessToken } = useAuth()

    // Split the URL to get the Type and ID
    const [_, type, id] = pathname.split("/")

    const [app, setApp] = useState<ApplicationItem>()
    const [error, setError] = useState<string>()
    const [appName, setAppName] = useState<string>('')
    const [editableAppName, setEditableAppName] = useState<boolean>(false)
    const [repo, setRepo] = useState<RepositoryItem>()

    useEffect(() => {
        async function getApplicationDetail() {
            try {
                const response = await getApplicationDetailById(id)
                if (response.success) {
                    setApp(response.data)
                    setAppName(response.data.app_name)

                    const repoResponse = await getRepositoryByAppId(id)
                    if (repoResponse.success) {
                        setRepo(repoResponse.data)
                    }
                } else {
                    setError("Error fetching application details")
                }
            } catch (err) {
                console.log(err)
                setError("Error calling getApplicationDetailById")
            }
        }
        getApplicationDetail()
    }, [])

    async function handleAppNameChanged() {
        try {
            const response = await editAppNameById(id, appName)
            if (response.success) {
                toast.info("Application has been renamed to " + appName)
                setEditableAppName(false)
                router.refresh()
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [showDeployHook, setShowDeployHook] = useState<boolean>(false)

    return (
        <DashboardPage groups={appStaticNavGroups(id)} showBackButton={true}>
            <div className="px-4 py-2 overflow-auto">
                <div className="flex justify-between items-center py-2">
                    <h1 className="text-[24px]">Service Detail Page</h1>
                    <Button variant="outline">Manual Deploy</Button>
                </div>
                <hr className="my-4" />
                <div className="my-4 flex flex-col space-y-2">
                    <h2 className="text-xl">Info {getMappingOption(app?.service_type || '')}</h2>
                    <a href={"http://" + app?.app_name + "." + "localhost"} target="_blank" className="text-blue-500">
                        {app?.app_name + "." + "localhost"}
                    </a>
                </div>
                <div className="p-6 border grid space-y-8">
                    <h2 className="text-lg font-medium">General</h2>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Name</div>
                        <div className="col-span-3 flex gap-4">
                            <Input
                                className="text-gray-300 disabled:text-gray-300"
                                value={appName}
                                onChange={(e) => setAppName(e.target.value)}
                                disabled={!editableAppName}
                            />
                            {editableAppName ? (
                                <div className="flex gap-4 items-center">
                                    <Button onClick={() => setEditableAppName(false)}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleAppNameChanged}>
                                        Save
                                    </Button>
                                </div>
                            ) : (
                                <Button onClick={() => setEditableAppName(!editableAppName)}>
                                    Edit
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Created</div>
                        <div className="col-span-3 text-gray-300 flex gap-4">
                            {moment(app?.created_at).format('MMMM Do YYYY, h:mm:ss a')}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Status</div>
                        <div>
                            <span className="flex">
                                {displayAppStatus(app?.status || '')}
                            </span>
                        </div>
                    </div>
                    {app?.options?.map((option: OptionItem, index) => {
                        const opt = getMappingOption(option.value)
                        return (
                            <div key={index} className="grid grid-cols-4 gap-4 items-center">
                                <div className="text-gray-300">{getMappingOption(option.key)}</div>
                                <div className="col-span-3 text-gray-300 flex gap-4">
                                    {opt == null ? option.value : opt}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="my-4"></div>
                <div className="p-6 border grid space-y-10">
                    <h2 className="text-lg font-medium">Build & Deploy</h2>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Repository</div>
                        <div className="col-span-3 flex gap-4">
                            <Input
                                className="text-gray-300 disabled:text-gray-300"
                                value={repo?.repo_url || ''}
                                disabled
                            />
                            <CopyToClipboard
                                text={repo?.repo_url || ''}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Branch</div>
                        <div className="col-span-3 flex gap-4">
                            <Input
                                className="text-gray-300"
                                value={repo?.branch || ''}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Deploy hook</div>
                        <div className="col-span-3 flex gap-4">
                            {showDeployHook ? (
                                <Textarea
                                    rows={6}
                                    className="text-gray-300"
                                    value={`curl --location --request POST '${API_BASE_URL}/applications/9a397a8d-d462-45a4-9a0b-3a33f0682d6e/redeploy' \ --header 'Authorization: Bearer ${accessToken}'`}
                                    disabled
                                />
                            ) : <Input value={'*******************'} disabled />}
                            <Button onClick={() => setShowDeployHook(!showDeployHook)} variant="outline">
                                Show
                            </Button>
                        </div>
                    </div>
                    {app?.ports.map((port: PortItem, index) => {
                        return (
                            <div key={index} className="grid space-y-10">
                                <div className="grid grid-cols-4 gap-4 items-center">
                                    <div className="text-gray-300">Container Port</div>
                                    <div className="col-span-3 flex gap-4">
                                        <Input
                                            className=""
                                            value={(port?.container_port) || ''}
                                            disabled
                                        />
                                        <CopyToClipboard
                                            text={port.host_port}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4 items-center">
                                    <div className="text-gray-300">Host Port</div>
                                    <div className="col-span-3 flex gap-4">
                                        <Input
                                            className="text-gray-300"
                                            value={(port?.host_port) || ''}
                                            disabled
                                        />
                                        <CopyToClipboard
                                            text={port.host_port}
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    {app?.env_vars.map((env_var: EnvVarItem) => {
                        return (
                            <div key={env_var.key} className="grid grid-cols-4 gap-4 items-center">
                                <div className="text-gray-300">{getMappingEnvVar(env_var.key)}</div>
                                <div className="col-span-3 flex gap-4">
                                    {env_var.is_secret ?
                                        <PasswordField
                                            value={env_var?.value || ''}
                                            disabled
                                        />
                                        :
                                        <Input
                                            value={env_var?.value || ''}
                                            disabled
                                        />
                                    }
                                    <CopyToClipboard
                                        text={env_var.value}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="flex space-x-4 py-4">
                    {/* Delete Database */}
                    <button className="flex items-center space-x-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300">
                        <Trash2 />
                        <span>Delete Static Site</span>
                    </button>

                    {/* Suspend Database */}
                    {app?.status === 'INACTIVE' ? (
                        <button className="flex items-center space-x-2 rounded-md bg-transparent px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 focus:outline-none focus:ring focus:ring-red-300">
                            <Play />
                            <span>Activate Static Site</span>
                        </button>
                    ) : (
                        <button className="flex items-center space-x-2 rounded-md bg-transparent px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 focus:outline-none focus:ring focus:ring-red-300">
                            <Pause />
                            <span>Suspend Static Site</span>
                        </button>
                    )}
                </div>
            </div>
        </DashboardPage>
    )
}

export default AppServiceDetailPage;