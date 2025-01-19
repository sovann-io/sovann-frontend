"use client"

import DashboardPage from "@/app/dashboard/page";
import CopyToClipboard from "@/components/shared/copy-to-clipboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { editAppNameById, getApplicationDetailById } from "@/services/application-service";
import { ApplicationItem } from "@/types/application-item";
import { Check, Pause, RotateCcw, Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import moment from 'moment';
import { DATABASE, getMappingEnvVar, getMappingOption, getMappingOptionValue, PASSWORD, SERVICE_TYPE, USERNAME } from "@/constants/misc";
import PasswordField from "@/components/shared/password-field";
import { EnvVarItem, OptionItem, PortItem } from "@/types/sub-app-item";
import { toast } from "sonner";

const ServiceDetailPage = () => {
    // Get the data from the URL
    const params = usePathname()

    // Split the URL to get the Type and ID
    const [_, type, id] = params.split("/")

    const [app, setApp] = useState<ApplicationItem>()
    const [error, setError] = useState<string>()
    const [internalUrl, setInternalUrl] = useState<string>('')
    const [externalUrl, setExternalUrl] = useState<string>('')
    const [appName, setAppName] = useState<string>('')
    const [editableAppName, setEditableAppName] = useState<boolean>(false)
    const [madeChange, setMadeChange] = useState<boolean>(false)

    useEffect(() => {
        async function getApplicationDetail() {
            try {
                const response = await getApplicationDetailById(id)
                if (response.success) {
                    setApp(response.data)
                    const { internal, external } = getIntExtDatabaseUrl(response.data)
                    setInternalUrl(internal)
                    setExternalUrl(external)
                    setAppName(response.data.app_name)
                } else {
                    setError("Error fetching application details")
                }
            } catch (err) {
                console.log(err)
                setError("Error calling getApplicationDetailById")
            }
        }
        getApplicationDetail()
    }, [madeChange, setMadeChange])

    async function handleAppNameChanged() {
        try {
            const response = await editAppNameById(id, appName)
            if (response.success) {
                toast.info("Application has been renamed to " + appName)
                setEditableAppName(false)
                setMadeChange(!madeChange)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <DashboardPage>
            <div className="px-4 py-2 overflow-auto">
                <div className="flex justify-between items-center py-2">
                    <h1 className="text-2xl">Service Detail Page</h1>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline">Connect</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Dimensions</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Set the dimensions for the layer.
                                    </p>
                                </div>
                                <div className="grid gap-2">
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="width">Width</Label>
                                        <Input
                                            id="width"
                                            defaultValue="100%"
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="maxWidth">Max. width</Label>
                                        <Input
                                            id="maxWidth"
                                            defaultValue="300px"
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="height">Height</Label>
                                        <Input
                                            id="height"
                                            defaultValue="25px"
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                    <div className="grid grid-cols-3 items-center gap-4">
                                        <Label htmlFor="maxHeight">Max. height</Label>
                                        <Input
                                            id="maxHeight"
                                            defaultValue="none"
                                            className="col-span-2 h-8"
                                        />
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <hr className="my-4" />
                <div className="my-6">
                    {app?.options?.map((option: OptionItem) => {
                        if (option.key === SERVICE_TYPE) {
                            return (
                                <h2 key={option.key + "_info"} className="text-2xl">Info {getMappingOption(option.value)}</h2>
                            )
                        }
                    })}
                </div>
                <div className="p-6 border grid space-y-10">
                    <h2 className="text-xl font-medium">General</h2>
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
                    <h2 className="text-xl font-medium">Connections</h2>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Hostname</div>
                        <div className="col-span-3 flex gap-4">
                            <Input
                                className="text-gray-300 disabled:text-gray-300"
                                value={app?.iphostname?.ip || ''}
                                disabled
                            />
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
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Internal Database URL</div>
                        <div className="col-span-3 flex gap-4">
                            <Input
                                className=""
                                value={internalUrl}
                                disabled
                            />
                            <CopyToClipboard
                                text={internalUrl}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">External Database URL</div>
                        <div className="col-span-3 flex gap-4">
                            <Input
                                className=""
                                value={externalUrl}
                                disabled
                            />
                            <CopyToClipboard
                                text={externalUrl}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex space-x-4 py-4">
                    {/* Delete Database */}
                    <button className="flex items-center space-x-2 rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300">
                        <Trash2 />
                        <span>Delete Database</span>
                    </button>

                    {/* Restart Database */}
                    <button className="flex items-center space-x-2 rounded-md bg-transparent px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 focus:outline-none focus:ring focus:ring-red-300">
                        <RotateCcw />
                        <span>Restart Database</span>
                    </button>

                    {/* Suspend Database */}
                    <button className="flex items-center space-x-2 rounded-md bg-transparent px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 focus:outline-none focus:ring focus:ring-red-300">
                        <Pause />
                        <span>Suspend Database</span>
                    </button>
                </div>
            </div>
        </DashboardPage>
    )
}

const displayAppStatus = (status: string) => {
    if (!status) return null; // Return nothing if no status is provided

    switch (status) {
        case 'ACTIVE':
            return (
                <span className="flex h-min items-center px-2 py-0.5 gap-2 border rounded-none bg-green-500 border-green-500 text-green-800">
                    <Check size={16} />
                    Active
                </span>
            );
        case 'PENDING':
        case 'INACTIVE':
        case 'DELETED':
            return <>A</>;
        default:
            return <>Unknown Status</>; // Optional fallback
    }
}

const getIntExtDatabaseUrl = (app: ApplicationItem | undefined) => {
    if (!app) return { internal: '', external: '' };

    // Extract serviceType from options
    const serviceType = app.options.reduce((type, option) => {
        return option.key === SERVICE_TYPE ? getMappingOptionValue(option.value) || '' : type;
    }, '');

    // Extract username, password, and database from env_vars
    const { username, password, db } = app.env_vars.reduce((acc, env: EnvVarItem) => {
        const key = getMappingEnvVar(env.key);
        if (key === USERNAME) acc.username = env.value;
        else if (key === PASSWORD) acc.password = env.value;
        else if (key === DATABASE) acc.db = env.value;
        return acc;
    }, { username: '', password: '', db: '' });

    // Extract internal and external ports
    const { internalPort, externalPort } = app.ports.reduce((acc, port: PortItem) => {
        acc.internalPort = port.container_port;
        acc.externalPort = port.host_port;
        return acc;
    }, { internalPort: '', externalPort: '' });

    // Construct internal and external URLs
    const internal = `${serviceType}://${username}:${password}@${app.app_name}:${internalPort}/${db}`;
    const external = `${serviceType}://${username}:${password}@${app.iphostname.ip}:${externalPort}/${db}`;

    return { internal, external };
};


export default ServiceDetailPage;