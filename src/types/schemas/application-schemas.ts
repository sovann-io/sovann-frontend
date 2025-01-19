import { z } from "zod";
import { DatabaseType } from "../database-item";
import { databaseConfigs } from "@/configs/database-config";

export const applicationFormSchema = z.object({
    app_name: z.string().min(1, "App name is required"),
    project_id: z.string().uuid("Invalid project ID"),
    description: z.string().optional(),
    deployed_version: z.string(),
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
    is_instant_deploy: z.boolean(),
    scheduled_deploy_at: z.string(),
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
    container_command: z.string().nullable(),
    env_vars: z.array(
        z.object({
            key: z.string(),
            value: z.string(),
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

export const createDefaultValues = (dbType: DatabaseType) => ({
    app_name: '',
    project_id: '5d3c9116-d86a-481e-95b3-2739d3c0b512',
    description: '1',
    deployed_version: 'testing',
    not_expose_as_web_app: false,
    has_persistent_data: false,
    has_default_subdomain_ssl: false,
    force_ssl: false,
    websocket_support: false,
    instance_count: 0,
    pre_deploy_function: '1',
    custom_nginx_config: '1',
    redirect_domain: '1',
    app_deploy_token_enabled: false,
    app_deploy_token: '1',
    is_app_building: false,
    is_instant_deploy: true,
    scheduled_deploy_at: new Date().toISOString(),
    http_auth_user: '1',
    http_auth_password: '1',
    dockerfile_content: '1',
    dockercompose_content: '1',
    status: 'DRAFT',
    networks: [],
    repo: null,
    container_command: '',
    env_vars: Array(dbType === 'mysql' ? 4 : 3).fill({ key: '', value: '', is_secret: false }),
    volumes: [],
    ports: [{
        container_port: databaseConfigs[dbType].defaultPort,
        host_port: dbType === 'mysql' ? 3311 : databaseConfigs[dbType].defaultPort,
        protocol: 'tcp',
        publish_mode: 'string'
    }],
    options: [
        { key: 'service_type', value: `db_${dbType}` },
        { key: 'tag', value: 'latest' }
    ],
});
