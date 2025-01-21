"use client";

import DashboardPage from "@/app/dashboard/page";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LazyLog } from "@melloware/react-logviewer";
import { API_BASE_URL } from "@/constants/auth";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, CircleX } from "lucide-react";
import { dynamicNavGroups, navGroups } from "@/constants/sidebar";


export default function SystemLogsPage() {
    const pathname = usePathname()
    const [connectToWS, setConnectToWS] = useState<boolean>(false);
    const [connectToWSLoading, setConnectToWSLoading] = useState<boolean>(false);
    const [buildLogs, setBuildLogs] = useState<BuildLogItem[]>([])

    const [_, type, id] = pathname.split("/")

    useEffect(() => {
        async function connectToBuildLogWS() {
            setConnectToWSLoading(true);
            try {
                // Simulating WebSocket or Database connection logic
                console.log("Connecting to WebSocket/Database with params:", id);
                await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
                setConnectToWS(true);
            } catch (error) {
                console.error("Connection failed:", error);
            } finally {
                setConnectToWSLoading(false);
            }
        }

        // connectToWS();

        // async function connectToBuildLog() {
        //     const response = await axios.get(API_BASE_URL + "/applications/" + params.id + "/container/logs");
        //     console.log(response.data);
        //     if (response.data.success) {
        //         setLogs(response.data.data);
        //     }
        // }
        // connectToBuildLog()

        async function connectToBuildLogDB() {
            const response = await axios.get(API_BASE_URL + "/build_logs/" + id + "/logs");
            const data = response.data;
            if (data.success) {
                setBuildLogs(data.data);
            }
        }
        if (connectToWS) {
            // connectToWS();
        } else {
            connectToBuildLogDB()
        }
    }, [pathname]);

    return (
        <DashboardPage groups={dynamicNavGroups(id)} showBackButton={true}>
            <div className="grid space-y-4">
                <div className="flex justify-between items-center py-1">
                    <h1 className="text-2xl">Systemx Logs</h1>
                    {/* {connectToWSLoading ? (
                        <span className="text-gray-500">Connecting...</span>
                    ) : connectToWS ? (
                        <span className="text-green-500">Connected</span>
                    ) : (
                        <span className="text-red-500">Disconnected</span>
                    )} */}
                    <div className="flex items-center space-x-4">
                        <Checkbox
                            id="logs-check"
                            checked={!connectToWS}
                            onCheckedChange={() => setConnectToWS(!connectToWS)}
                        />
                        <Label htmlFor="logs-check" className="ml-2">Get logs from database</Label>
                    </div>
                </div>
            </div>
            {!connectToWS && (
                <>
                    {buildLogs.length === 0 && <div className="text-lg text-center text-gray-400">No logs available</div>}
                    <Accordion type="multiple" className="w-full" defaultValue={["items-0"]}>
                        {buildLogs.map((log, index) => (
                            <AccordionItem key={index} value={`items-${index}`}>
                                <AccordionTrigger className="">
                                    <div className="flex justify-start items-center gap-4">
                                        {log.is_success ? (
                                            <div className="text-green-500">
                                                <Check size={21} />
                                            </div>
                                        ) : (
                                            <div className="text-red-500">
                                                <CircleX size={21} />
                                            </div>
                                        )}
                                        <span className="text-lg">Version: {log.version}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-2">
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
                                        height={375}
                                        text={log.logs}
                                        formatPart={part => {
                                            if (part.includes("Error")) {
                                                return <span style={{ color: "red" }}>{part}</span>;
                                            }
                                            return <span className="text-green-500">{part}</span>;
                                        }}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </>
            )}
        </DashboardPage >
    );
}
