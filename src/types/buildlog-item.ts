interface BuildLogItem {
    app_id: string;
    build_ended_at: string; // ISO 8601 format recommended
    build_started_at: string; // ISO 8601 format recommended
    id: string;
    is_success: boolean;
    logs: string;
    task_id: string;
    version: string;
}
