import { EnvVarItem, OptionItem, PortItem } from "./sub-app-item";

export interface ApplicationItem {
    app_deploy_token: string;
    app_deploy_token_enabled: boolean;
    app_name: string;
    created_at?: string
    updated_at?: string
    iphostname: {
        hostname: string,
        ip: string,
    }
    container_command: string | null;
    service_type: string | null;
    custom_nginx_config: string;
    deployed_version: string;
    description: string;
    dockercompose_content: string | null;
    dockerfile_content: string | null;
    force_ssl: boolean;
    has_default_subdomain_ssl: boolean;
    has_persistent_data: boolean;
    http_auth_password: string | null;
    http_auth_user: string;
    id: string;
    instance_count: number;
    is_app_building: boolean;
    is_instant_deploy: boolean;
    not_expose_as_web_app: boolean;
    pre_deploy_function: string;
    project_id: string; // Assuming "None" is a placeholder; consider using a specific type if needed
    redirect_domain: string;
    scheduled_deploy_at: string | null;
    status: string;
    websocket_support: boolean;
    options: [OptionItem],
    ports: [PortItem],
    env_vars: [EnvVarItem],
    networks: [string],
    repo: {
        repo_url: string,
        branch: string,
    }
}
