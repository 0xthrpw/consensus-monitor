interface EnvironmentVariables {
    readonly ENV_ID_PROD: string;
    readonly ENV_ID_US_EAST: string;
    readonly ENV_ID_US_WEST: string;
    readonly ENV_ID_EU_WEST: string;
    readonly ENV_ID_ASIA_EAST: string;
    readonly RAILWAY_API_TOKEN: string;
    readonly RAILWAY_PROJECT_ID: string;
    readonly SERVICE_PRIMARY_INDEXER_BASE: string;
    readonly SERVICE_SECONDARY_INDEXER_BASE: string;
    readonly SERVICE_LIST_RECORDS_OP: string;
    readonly SERVICE_LIST_RECORDS_ETH: string;
    readonly TG_BOT_TOKEN: string;
    readonly TG_CHAT_ID: string;
    readonly TG_ADMIN_ID: string;
    readonly DB_PROD: string;
    readonly DB_US_WEST: string;
    readonly DB_US_EAST: string;
    readonly DB_EU: string;
    readonly DB_ASIA: string;
    readonly PRIMARY_RPC_BASE: string;
    readonly PRIMARY_RPC_OP: string;
    readonly PRIMARY_RPC_ETH: string;
    readonly RECOVERY_INTERVAL: string;
}

declare module "bun" {
	interface Env extends EnvironmentVariables {}
}

declare namespace NodeJs {
	interface ProcessEnv extends EnvironmentVariables {}
}
