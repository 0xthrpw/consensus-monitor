interface EnvironmentVariables {
    readonly TG_BOT_TOKEN: string;
    readonly TG_CHAT_ID: string;
    readonly TG_ADMIN_ID: string;
    readonly DB_PROD: string;
    readonly DB_US_WEST: string;
    readonly DB_US_EAST: string;
    readonly DB_EU: string;
    readonly DB_ASIA: string;
}

declare module "bun" {
	interface Env extends EnvironmentVariables {}
}

declare namespace NodeJs {
	interface ProcessEnv extends EnvironmentVariables {}
}
