import { DatabaseType, DatabaseVersionConfig } from "@/types/database-item";

const DEFAULT_VERSIONS = ['latest'];

export const DATABASE_VERSIONS: Record<DatabaseType, DatabaseVersionConfig> = {
    mysql: {
        versions: [...DEFAULT_VERSIONS, '8', '7', '6'].map(value => ({ value, label: value })),
        description: 'The MySQL version'
    },
    postgresql: {
        versions: [...DEFAULT_VERSIONS, '13', '12', '11'].map(value => ({ value, label: value })),
        description: 'The PostgreSQL version'
    }
};