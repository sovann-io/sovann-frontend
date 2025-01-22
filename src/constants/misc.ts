export const SERVICE_TYPE = 'service_type'
export const TAG = 'tag'
export const USERNAME = 'Username'
export const PASSWORD = 'Password'
export const DATABASE = 'Database'

export const getMappingOption = (key: string) => {
    const dict: { [key: string]: string } = {
        'db_mysql': 'MySQL',
        'db_postgresql': 'PostgreSQL',
        'app_static': 'Static Site',
        'service_type': 'Service Type',
        'tag': 'Tag',
        'latest': "Latest"
    };
    return dict[key] || null; // Returns the mapped value if it exists, or null if the key is not found
};

export const getMappingOptionValue = (value: string) => {
    const dict: { [value: string]: string } = {
        'db_mysql': 'mysql',
        'db_postgresql': 'postgresql',
        'db_mongo': 'mongo'
    };
    return dict[value] || ''; // Returns the mapped value if it exists, or null if the key is not found
};

export const getMappingEnvVar = (key: string) => {
    const dict: { [key: string]: string } = {
        "MYSQL_DATABASE": DATABASE,
        "MYSQL_USER": USERNAME,
        "MYSQL_PASSWORD": PASSWORD,
        "MYSQL_ROOT_PASSWORD": "Root Password",
        "POSTGRES_DB": DATABASE,
        "POSTGRES_USER": USERNAME,
        "POSTGRES_PASSWORD": PASSWORD,
    };
    return dict[key] || null; // Returns the mapped value if it exists, or null if the key is not found
};