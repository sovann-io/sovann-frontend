"use client";

import DashboardPage from "@/app/dashboard/page";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LazyLog, ScrollFollow } from "@melloware/react-logviewer";
import { API_BASE_URL } from "@/constants/auth";
import axios from "axios";
import { appStaticNavGroups, dynamicNavGroups } from "@/constants/sidebar";


export default function ContainerLogsPage() {
    const pathname = usePathname()
    const [logs, setLogs] = useState<string[]>([])

    const [_, type, id] = pathname.split("/")

    useEffect(() => {
        async function connectToContainerLogDB() {
            const response = await axios.get(API_BASE_URL + "/applications/" + id + "/container/logs");
            const data = response.data;
            console.log(data)
            if (data.success) {
                setLogs(data.data);
            }
        }
        connectToContainerLogDB()
    }, [pathname]);

    return (
        <DashboardPage groups={appStaticNavGroups(id)} showBackButton={true}>
            <div className="grid space-y-4">
                <div className="flex justify-between items-center py-1">
                    <h1 className="text-2xl">Container Logs</h1>
                </div>
            </div>
            <div className="w-full max-h-full h-full">
                {logs.length === 0 && <div className="text-lg text-center text-gray-400">No logs available</div>}
                {logs.length > 0 && (
                    <LazyLog
                        caseInsensitive
                        enableHotKeys
                        enableSearch
                        enableLineNumbers
                        enableLinks
                        enableGutters
                        enableSearchNavigation
                        selectableLines
                        enableMultilineHighlight={true}
                        style={{}}
                        text={logs.join("\n")}
                        formatPart={part => {
                            if (part.includes("Error")) {
                                return <span style={{ color: "red" }}>{part}</span>;
                            }
                            return <span className="text-green-500">{part}</span>;
                        }}
                    />
                )}
            </div>
        </DashboardPage >
    );
}
