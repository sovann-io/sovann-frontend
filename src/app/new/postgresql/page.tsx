'use client';

import DatabaseLayout from "@/components/shared/layout/database-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import DashboardPage from "@/app/dashboard/page";

import { useState } from "react";
import { DateTimePicker } from "@/components/shared/date-time-picker";
import { Button } from "@/components/ui/button";
import { ApplicationFormValues } from "@/types/schemas/application-schemas";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import axios from 'axios';
import { API_BASE_URL } from "@/constants/auth";
import { generateScheduledDeployAt, SCHEDULE_OFFSET } from "@/lib/datetime";

const CreatePostgreSQL = () => {
    const { accessToken } = useAuth();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);
    const {
        setValue,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ApplicationFormValues>({
        defaultValues: {
            app_name: "",
            project_id: "5d3c9116-d86a-481e-95b3-2739d3c0b512",
            description: "1",
            deployed_version: "testing",
            not_expose_as_web_app: false,
            has_persistent_data: false,
            has_default_subdomain_ssl: false,
            force_ssl: false,
            websocket_support: false,
            instance_count: 0,
            pre_deploy_function: "1",
            custom_nginx_config: "1",
            redirect_domain: "1",
            app_deploy_token_enabled: false,
            app_deploy_token: "1",
            is_app_building: false,
            is_instant_deploy: true,
            scheduled_deploy_at: new Date().toISOString(),
            http_auth_user: "1",
            http_auth_password: "1",
            dockerfile_content: "1",
            dockercompose_content: "1",
            status: "DRAFT",
            networks: [],
            repo: null,
            container_command: "",
            env_vars: Array(4).fill({ key: "", value: "", is_secret: false }),
            volumes: [],
            ports: [{
                "container_port": 5432,
                "host_port": 5432,
                "protocol": "tcp",
                "publish_mode": "string"
            }],
            options: [{ key: "service_type", value: "db_postgresql" }, { key: "tag", value: "latest" }],
        },
    });

    const handleEnvVarChange = (index: number, key: string, value: string) => {
        setValue(`env_vars.${index}.key`, key);
        setValue(`env_vars.${index}.value`, value);
    };

    const onSubmit: SubmitHandler<ApplicationFormValues> = async (data) => {
        console.log(data)
        data.scheduled_deploy_at = isScheduleEnabled
            ? data.scheduled_deploy_at.slice(0, 19)
            : generateScheduledDeployAt();
        console.log(data)
        if (!accessToken) {
            toast.error("You need to be logged in to submit the form");
            return;
        }

        const myHeaders = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`, // Use the actual access token
        };

        try {
            const response = await axios.post(`${API_BASE_URL}/applications/actual-create`, data, { headers: myHeaders });
            console.log("Response from API:", response.data);
            toast.success("Database created successfully!");
        } catch (error) {
            console.error("Error submitting form", error);
            toast.error("Error creating database");
        }
    };

    return (
        <DashboardPage>
            <DatabaseLayout title="Create PostgreSQL Database">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-8 space-y-4">
                        {[
                            {
                                label: "Name",
                                placeholder: "example-postgresql-name",
                                description: "A unique name for your PostgreSQL instance",
                                field: "app_name",
                            },
                            {
                                label: "Database",
                                placeholder: "randomly generated unless specified",
                                description: "The PostgreSQL dbname",
                                onChange: (e: any) => handleEnvVarChange(0, "POSTGRESQL_DB", e.target.value),
                            },
                            {
                                label: "User",
                                placeholder: "randomly generated unless specified",
                                description: "The PostgreSQL user",
                                onChange: (e: any) => handleEnvVarChange(1, "POSTGRESQL_USER", e.target.value),
                            },
                            {
                                label: "Password",
                                placeholder: "randomly generated unless specified",
                                description: "The PostgreSQL password",
                                onChange: (e: any) => handleEnvVarChange(2, "POSTGRESQL_PASSWORD", e.target.value),
                            },
                        ].map(({ label, placeholder, description, field, onChange }, idx) => (
                            <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                                <div>
                                    <Label className="text-base font-medium text-gray-900 dark:text-gray-300">{label}</Label>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
                                </div>
                                <Input
                                    className="col-span-1 sm:col-span-3 h-full px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={placeholder}
                                    {...(field ? register(field as keyof ApplicationFormValues) : {})}
                                    {...(onChange ? { onChange } : {})}
                                />
                            </div>
                        ))}

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                            <div>
                                <Label className="text-base font-medium text-gray-900 dark:text-gray-300">Version</Label>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">The PostgreSQL version</p>
                            </div>
                            <Select
                                onValueChange={(value) => setValue("options.1", { key: "tag", value })}
                                defaultValue="latest"
                            >
                                <SelectTrigger className="col-span-1 sm:col-span-3 h-full w-full">
                                    <SelectValue placeholder="latest" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Version</SelectLabel>
                                        {['latest', '8', '7', '6'].map(version => (
                                            <SelectItem key={version} value={version}>{version}</SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                            <div>
                                <Label className="text-base font-medium text-gray-900 dark:text-gray-300">Schedule</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={isScheduleEnabled}
                                    onCheckedChange={(checked) => {
                                        setIsScheduleEnabled(checked === true);
                                        if (!checked) {
                                            setDate(undefined);
                                            setValue("scheduled_deploy_at", generateScheduledDeployAt());
                                        }
                                    }}
                                />
                                <label htmlFor="terms" className="text-sm font-medium leading-none">
                                    Enable automatic instance creation
                                </label>
                            </div>
                            <div>
                                <DateTimePicker
                                    value={date}
                                    onChange={(value) => {
                                        setDate(value);
                                        setValue("scheduled_deploy_at", value ? new Date(value.getTime() + SCHEDULE_OFFSET).toISOString() : "");
                                    }}
                                    className="w-[280px]"
                                    disabled={!isScheduleEnabled}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                            <div>
                                <Label className="text-base font-medium text-gray-900 dark:text-gray-300">Schedule</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={isScheduleEnabled}
                                    onCheckedChange={(checked) => {
                                        setIsScheduleEnabled(checked === true);
                                        if (!checked) {
                                            setDate(undefined);
                                            setValue("scheduled_deploy_at", generateScheduledDeployAt());
                                        }
                                    }}
                                />
                                <label htmlFor="terms" className="text-sm font-medium leading-none">
                                    Enable automatic instance creation
                                </label>
                            </div>
                        </div>
                        <div className="items-center">
                            <Button type="submit" className="px-8 h-full">
                                Create Database
                            </Button>
                        </div>
                    </div>
                </form>
            </DatabaseLayout>
        </DashboardPage>
    );
};

export default CreatePostgreSQL;
