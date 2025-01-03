import { sql, Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import type { DB } from "#/dbtypes.ts";
import { env } from "#/env.ts";

export function createClient(url: string): Kysely<DB> {
    const client = postgres(url);

    const database = new Kysely<DB>({
        dialect: new PostgresJSDialect({
            postgres: client,
        }),
    });
    return database;
}

export function getClients(): { [key: string]: Kysely<DB> } {
    return {
        'prod': createClient(env.DB_PROD),
        'use1': createClient(env.DB_US_EAST), 
        'usw1': createClient(env.DB_US_WEST),
        'euw1': createClient(env.DB_EU),
        'asia': createClient(env.DB_ASIA)
    }
}

async function getListMeta(database: Kysely<DB>): Promise<number> {
    const query = sql<string>` SELECT * FROM public.efp_list_metadata`
    const result = await query.execute(database)
    return result.rows.length
}

export async function consensus(ctx:any): Promise<void> {
    const db = getClients();
    console.log('Checking EFP silo consensus...')
    await ctx.reply("checking consensus...")

    for (const key in db) {
        const listMeta = await getListMeta(db[key]);
        await ctx.reply(`${key}: ${listMeta}`)
    }

    await ctx.reply("finished")
}