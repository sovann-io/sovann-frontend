"use client"

import DashboardPage from "@/app/dashboard/page";
import CopyToClipboard from "@/components/shared/copy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Pause, RotateCcw, Trash2 } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

const ServiceDetailPage = () => {
    // Get the data from the URL
    const params = usePathname()
    // Split the URL to get the Type and ID
    const [_, type, id] = params.split("/")
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
                    <h2 className="text-2xl">Info</h2>
                </div>
                <div className="px-6 py-3 border grid space-y-10">
                    <h2 className="text-xl font-medium">General</h2>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Name</div>
                        <div className="col-span-3 flex gap-4">
                            <Input
                                className=""
                                value="Service Name"
                                disabled
                            />
                            <Button>
                                Edit
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Created</div>
                        <div className="col-span-3 text-gray-300 flex gap-4">
                            16th August 2021
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Status</div>
                        <div>
                            <span className="flex">
                                <span className="flex h-min items-center px-2 py-0.5 gap-2 border rounded-none bg-green-500 border-green-500 text-green-800">
                                    <Check size={16} />
                                    Active
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">PostgreSQL Version</div>
                        <div className="col-span-3 text-gray-300 flex gap-4">
                            16
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Storage</div>
                        <div className="col-span-3 text-gray-300 flex gap-4">
                            16
                        </div>
                    </div>
                </div>
                <div className="my-4"></div>
                <div className="px-6 py-3 border grid space-y-10">
                    <h2 className="text-xl font-medium">Connections</h2>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Hostname</div>
                        <div className="col-span-3 flex gap-4">
                            <Input
                                className=""
                                value="Hostname"
                                disabled
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Port</div>
                        <div className="col-span-3 flex gap-4">
                            <Input
                                className=""
                                value="Port"
                                disabled
                            />
                            <CopyToClipboard
                                text="Port"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Database</div>
                        <div className="col-span-3 flex gap-4">
                            <Input
                                className=""
                                value="Database"
                                disabled
                            />
                            <CopyToClipboard
                                text="Database"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Username</div>
                        <div className="col-span-3 flex gap-4">
                            <Input
                                className=""
                                value="Username"
                                disabled
                            />
                            <CopyToClipboard
                                text="Username"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">Password</div>
                        <div className="col-span-3 flex gap-4">
                            <Input
                                className=""
                                value="Password"
                                disabled
                            />
                            <CopyToClipboard
                                text="Password"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-gray-300">External Database URL</div>
                        <div className="col-span-3 flex gap-4">
                            <Input
                                className=""
                                value="External Database URL"
                                disabled
                            />
                            <CopyToClipboard
                                text="External Database URL"
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

export default ServiceDetailPage;