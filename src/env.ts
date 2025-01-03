export function raise(error: unknown): never {
	throw typeof error === "string" ? new Error(error) : error;
}

export const env = Object.freeze({
    TG_BOT_TOKEN: getEnvVariable("TG_BOT_TOKEN"),
    TG_CHAT_ID: getEnvVariable("TG_CHAT_ID"),
    TG_ADMIN_ID: getEnvVariable("TG_ADMIN_ID"),
    DB_PROD: getEnvVariable("DB_PROD"),
    DB_US_WEST: getEnvVariable("DB_US_WEST"),
    DB_US_EAST: getEnvVariable("DB_US_EAST"),
    DB_EU: getEnvVariable("DB_EU"),
    DB_ASIA: getEnvVariable("DB_ASIA")
});

function getEnvVariable<T extends keyof EnvironmentVariables>(name: T) {
    return process.env[name] ?? raise(`environment variable ${name} not found`);
}
