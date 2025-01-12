import { z } from "zod";

export const applicationFormSchema = z.object({
    app_name: z.string().min(1, "App name is required"),
    project_id: z.string().uuid("Invalid project ID"),
    node_id: z.string().uuid("Invalid node ID"),
    description: z.string().optional(),
    deployed_version: z.number().min(0),
    not_expose_as_web_app: z.boolean(),
    has_persistent_data: z.boolean(),
    has_default_subdomain_ssl: z.boolean(),
    force_ssl: z.boolean(),
    websocket_support: z.boolean(),
    instance_count: z.number().min(0),
    pre_deploy_function: z.string().optional(),
    custom_nginx_config: z.string().optional(),
    redirect_domain: z.string().optional(),
    app_deploy_token_enabled: z.boolean(),
    app_deploy_token: z.string().optional(),
    is_app_building: z.boolean(),
    is_instant_building: z.boolean(),
    http_auth_user: z.string().optional(),
    http_auth_password: z.string().optional(),
    dockerfile_content: z.string().optional(),
    dockercompose_content: z.string().optional(),
    status: z.string(),
    networks: z.array(z.string()).optional(),
    repo: z.object({
        repo_url: z.string().url(),
        branch: z.string().nullable(),
        username: z.string().nullable(),
        password: z.string().nullable(),
        ssh_key: z.string().nullable(),
        provider: z.string().nullable(),
    }).nullable(),
    command: z.string().nullable(),
    env_vars: z.array(
        z.object({
            key: z.string().min(1),
            value: z.string().min(1),
            is_secret: z.boolean(),
        })
    ),
    volumes: z.array(z.string()).optional(),
    ports: z.array(
        z.object({
            container_port: z.number(),
            host_port: z.number(),
            protocol: z.string(),
            publish_mode: z.string(),
        })
    ),
    options: z.array(
        z.object({
            key: z.string(),
            value: z.string(),
        })
    ),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;