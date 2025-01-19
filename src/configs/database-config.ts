import { DatabaseConfig, DatabaseType } from "@/types/database-item";

export const databaseConfigs: Record<DatabaseType, DatabaseConfig> = {
    postgresql: {
        type: 'postgresql',
        title: 'Create PostgreSQL Database',
        defaultPort: 5432,
        envVarPrefix: 'POSTGRES',
        fields: [
            {
                label: 'Name',
                placeholder: 'example-postgresql-name',
                description: 'A unique name for your PostgreSQL instance',
                envKey: 'app_name'
            },
            {
                label: 'Database',
                placeholder: 'randomly generated unless specified',
                description: 'The PostgreSQL dbname',
                envKey: 'DB'
            },
            {
                label: 'User',
                placeholder: 'randomly generated unless specified',
                description: 'The PostgreSQL user',
                envKey: 'USER'
            },
            {
                label: 'Password',
                placeholder: 'randomly generated unless specified',
                description: 'The PostgreSQL password',
                envKey: 'PASSWORD'
            }
        ]
    },
    mysql: {
        type: 'mysql',
        title: 'Create MySQL Database',
        defaultPort: 3306,
        envVarPrefix: 'MYSQL',
        fields: [
            {
                label: 'Name',
                placeholder: 'example-mysql-name',
                description: 'A unique name for your MySQL instance',
                envKey: 'app_name'
            },
            {
                label: 'Database',
                placeholder: 'randomly generated unless specified',
                description: 'The MySQL dbname',
                envKey: 'DATABASE'
            },
            {
                label: 'User',
                placeholder: 'randomly generated unless specified',
                description: 'The MySQL user',
                envKey: 'USER'
            },
            {
                label: 'Password',
                placeholder: 'randomly generated unless specified',
                description: 'The MySQL password',
                envKey: 'PASSWORD'
            },
            {
                label: 'Root Password',
                placeholder: 'randomly generated unless specified',
                description: 'The MySQL root password',
                envKey: 'ROOT_PASSWORD'
            }
        ]
    }
};