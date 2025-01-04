import { env } from "#/env.ts";
import { sql, Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import type { DB } from "#/dbtypes.ts";

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
    const db: { [key: string]: Kysely<DB> }  = {
        'prod': createClient(env.DB_PROD),
        'usEast': createClient(env.DB_US_EAST), 
        'usWest': createClient(env.DB_US_WEST),
        'euWest': createClient(env.DB_EU),
        'asiaEast': createClient(env.DB_ASIA)
    }
    return db
}

export async function listMetaBase(database: Kysely<DB>): Promise<number> {
    const query = sql<string>` SELECT * FROM public.efp_list_metadata WHERE chain_id = 8453`
    const result = await query.execute(database)
    return result.rows.length
}

export async function listMetaOp(database: Kysely<DB>): Promise<number> {
    const query = sql<string>` SELECT * FROM public.efp_list_metadata WHERE chain_id = 10`
    const result = await query.execute(database)
    return result.rows.length
}

export async function listMetaEth(database: Kysely<DB>): Promise<number> {
    const query = sql<string>` SELECT * FROM public.efp_list_metadata WHERE chain_id = 1`
    const result = await query.execute(database)
    return result.rows.length
}

export async function lists(database: Kysely<DB>): Promise<number> {
    const query = sql<string>` SELECT * FROM public.efp_lists`
    const result = await query.execute(database)
    return result.rows.length
}

export async function listOpEvents(database: Kysely<DB>): Promise<number> {
    const events = sql<string>`
        SELECT * 
        FROM public.events 
        WHERE events.event_name::text = 'ListOp'::text`
    const eventsResult = await events.execute(database)
    return eventsResult.rows.length
}

export async function listRecordsBase(database: Kysely<DB>): Promise<number> {
    const listRecords = sql<string>`
        SELECT * 
        FROM public.efp_list_records
        WHERE chain_id = 8453`
    const listRecordsResult = await listRecords.execute(database)
    return listRecordsResult.rows.length
}

export async function listRecordsOp(database: Kysely<DB>): Promise<number> {
    const listRecords = sql<string>`
        SELECT * 
        FROM public.efp_list_records
        WHERE chain_id = 10`
    const listRecordsResult = await listRecords.execute(database)
    return listRecordsResult.rows.length
}

export async function listRecordsEth(database: Kysely<DB>): Promise<number> {
    const listRecords = sql<string>`
        SELECT * 
        FROM public.efp_list_records
        WHERE chain_id = 1`
    const listRecordsResult = await listRecords.execute(database)
    return listRecordsResult.rows.length
}

export async function accountMeta(database: Kysely<DB>): Promise<number> {
    const query = sql<string>`
        SELECT * 
        FROM public.efp_account_metadata`
    const result = await query.execute(database)
    return result.rows.length
}

export async function lSLUpdate(database: Kysely<DB>): Promise<number> {
    const query = sql<string>`
        SELECT * 
        FROM public.events 
        WHERE event_name = 'UpdateListStorageLocation'`
    const result = await query.execute(database)
    return result.rows.length
}