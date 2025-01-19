import { API_BASE_URL } from "@/constants/auth";
import { useEffect, useState } from "react";

const ContainerLog = ({ appId }: { appId: string }) => {
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/applications/${appId}/container/logs`);
                const data = await response.json();
                // Split logs into an array by newline
                if (data.status == 'success') {
                    setLogs(data.data.split('\n').slice(0, -1));
                }
            } catch (error) {
                console.error("Failed to fetch logs:", error);
                setLogs(["Error fetching logs"]);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [appId]);

    return (
        <div className="max-h-[60vh] overflow-auto">
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    {logs.map((log, index) => (
                        <p key={index} className="text-green-400">
                            ={'>'} {log}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContainerLog;
