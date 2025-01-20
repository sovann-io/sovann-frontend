"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/use-auth';
import axios from 'axios';
import { API_BASE_URL } from '@/constants/auth';
import DatabaseLayout from '@/components/shared/layout/database-layout';
import DashboardPage from '@/app/dashboard/page';
import { toast } from 'sonner';
import { DatabaseType } from '@/types/database-item';
import { databaseConfigs } from '@/configs/database-config';
import { createDefaultValues } from '@/types/schemas/application-schemas';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { generateScheduledDeployAt, SCHEDULE_OFFSET } from '@/utils/datetime';
import { Button } from '../ui/button';
import { VersionSelect } from './version-selection';
import { ScheduleSection } from './schedule-selection';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { postgreSQLNavGroups } from '@/constants/sidebar';

interface DatabaseFormProps {
    dbType: DatabaseType;
}

export const DatabaseForm = ({ dbType }: DatabaseFormProps) => {
    const { accessToken, user } = useAuth();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isScheduleEnabled, setIsScheduleEnabled] = useState(false);
    const config = databaseConfigs[dbType];

    const {
        setValue,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: createDefaultValues(dbType)
    });

    const handleEnvVarChange = (index: number, key: string, value: string) => {
        setValue(`env_vars.${index}.key`, key);
        setValue(`env_vars.${index}.value`, value);
    };

    const onSubmit = async (data: any) => {
        console.log(data)

        if (!accessToken || !user) {
            toast.error('You need to be logged in to submit the form');
            return;
        }

        data.scheduled_deploy_at = isScheduleEnabled
            ? data.scheduled_deploy_at.slice(0, 19)
            : generateScheduledDeployAt();

        try {
            const response = await axios.post(
                `${API_BASE_URL}/applications/actual-create`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            toast.success('Database created successfully!');
        } catch (error) {
            console.error('Error submitting form', error);
            toast.error('Error creating database');
        }
    };

    return (
        <DashboardPage
            groups={postgreSQLNavGroups}
            showBackButton={true}
        >
            <DatabaseLayout title={config.title}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-8 space-y-4">
                        {config.fields.map(({ label, placeholder, description, envKey }, idx) => (
                            <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                                <div>
                                    <Label className="text-base font-medium text-gray-900 dark:text-gray-300">
                                        {label}
                                    </Label>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {description}
                                    </p>
                                </div>
                                <Input
                                    className="col-span-1 sm:col-span-3 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={placeholder}
                                    {...(envKey === 'app_name'
                                        ? register('app_name')
                                        : {
                                            onChange: (e: any) =>
                                                handleEnvVarChange(
                                                    idx - 1,
                                                    `${config.envVarPrefix}_${envKey}`,
                                                    e.target.value
                                                )
                                        }
                                    )}
                                />
                            </div>
                        ))}

                        <VersionSelect
                            dbType={dbType}
                            onValueChange={(value) => setValue('options.1', { key: 'tag', value })}
                        />


                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
                            <div>
                                <Label className="text-base font-medium text-gray-900 dark:text-gray-300">
                                    Create Now or Schedule
                                </Label>
                            </div>
                            <div className="col-span-1 sm:col-span-3">
                                <RadioGroup
                                    className='flex gap-6'
                                    value={isScheduleEnabled ? 'schedule' : 'now'}
                                    onValueChange={
                                        (value) => {
                                            if (value === 'now') {
                                                setIsScheduleEnabled(false)
                                            } else if (value === 'schedule') {
                                                setIsScheduleEnabled(true)
                                            } else {
                                                setIsScheduleEnabled(false)
                                            }
                                        }
                                    }>
                                    <div className='flex items-center justify-start space-x-2'>
                                        <RadioGroupItem
                                            id="now"
                                            value="now"
                                        />
                                        <Label htmlFor='now'>Now</Label>
                                    </div>
                                    <div className='flex items-center justify-start space-x-2'>
                                        <RadioGroupItem
                                            id="schedule"
                                            value="schedule"
                                        />
                                        <Label htmlFor='schedule'>Schedule</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        <ScheduleSection
                            isEnabled={isScheduleEnabled}
                            date={date}
                            onEnableChange={setIsScheduleEnabled}
                            onDateChange={(value) => {
                                setDate(value);
                                setValue(
                                    'scheduled_deploy_at',
                                    value
                                        ? new Date(value.getTime() + SCHEDULE_OFFSET).toISOString()
                                        : ''
                                );
                            }}
                            onDisable={() => {
                                setDate(undefined);
                                setValue('scheduled_deploy_at', generateScheduledDeployAt());
                            }}
                        />

                        <div className="flex items-center gap-6">
                            <Button type="submit" className="px-8 h-full">
                                Create Database
                            </Button>
                            {/* <Button type="submit" className="px-8 h-full">
                                Save Draft
                            </Button> */}
                        </div>
                    </div>
                </form>
            </DatabaseLayout>
        </DashboardPage>
    );
};

