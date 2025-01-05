export function raise(error: unknown): never {
	throw typeof error === "string" ? new Error(error) : error;
}

export const env = Object.freeze({
    // RAILWAY ENVIROMENT IDS
    ENV_ID_PROD: getEnvVariable("ENV_ID_PROD"),
    ENV_ID_US_EAST: getEnvVariable("ENV_ID_US_EAST"),
    ENV_ID_US_WEST: getEnvVariable("ENV_ID_US_WEST"),
    ENV_ID_EU_WEST: getEnvVariable("ENV_ID_EU_WEST"),
    ENV_ID_ASIA_EAST: getEnvVariable("ENV_ID_ASIA_EAST"),
    // RAILWAY
    RAILWAY_API_TOKEN: getEnvVariable("RAILWAY_API_TOKEN"),
    RAILWAY_PROJECT_ID: getEnvVariable("RAILWAY_PROJECT_ID"),
    // RAILWAY SERVICE IDS
    SERVICE_PRIMARY_INDEXER_BASE: getEnvVariable("SERVICE_PRIMARY_INDEXER_BASE"),
    SERVICE_SECONDARY_INDEXER_BASE: getEnvVariable("SERVICE_SECONDARY_INDEXER_BASE"),
    SERVICE_LIST_RECORDS_OP: getEnvVariable("SERVICE_LIST_RECORDS_OP"),
    SERVICE_LIST_RECORDS_ETH: getEnvVariable("SERVICE_LIST_RECORDS_ETH"),
    // TELEGRAM
    TG_BOT_TOKEN: getEnvVariable("TG_BOT_TOKEN"),
    TG_CHAT_ID: getEnvVariable("TG_CHAT_ID"),
    TG_ADMIN_ID: getEnvVariable("TG_ADMIN_ID"),
    // DATABASE
    DB_PROD: getEnvVariable("DB_PROD"),
    DB_US_WEST: getEnvVariable("DB_US_WEST"),
    DB_US_EAST: getEnvVariable("DB_US_EAST"),
    DB_EU: getEnvVariable("DB_EU"),
    DB_ASIA: getEnvVariable("DB_ASIA"),
    // RPC
    PRIMARY_RPC_BASE: getEnvVariable("PRIMARY_RPC_BASE"),
    PRIMARY_RPC_OP: getEnvVariable("PRIMARY_RPC_OP"),
    PRIMARY_RPC_ETH: getEnvVariable("PRIMARY_RPC_ETH"),

    RECOVERY_INTERVAL: getEnvVariable("RECOVERY_INTERVAL")
});

function getEnvVariable<T extends keyof EnvironmentVariables>(name: T) {
    return process.env[name] ?? raise(`environment variable ${name} not found`);
}
