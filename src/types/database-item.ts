export type DatabaseType = 'postgresql' | 'mysql';

export interface DatabaseField {
    label: string;
    placeholder: string;
    description: string;
    envKey: string;
}

export interface DatabaseConfig {
    type: DatabaseType;
    title: string;
    defaultPort: number;
    envVarPrefix: string;
    fields: DatabaseField[];
}

export interface ScheduleSectionProps {
    isEnabled: boolean;
    date?: Date;
    onEnableChange: (enabled: boolean) => void;
    onDateChange: (date: Date | undefined) => void;
    onDisable: () => void;
}

export interface DatabaseVersion {
    value: string;
    label: string;
}

export interface DatabaseVersionConfig {
    versions: DatabaseVersion[];
    description: string;
}