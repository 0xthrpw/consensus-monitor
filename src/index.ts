import { Bot } from "grammy";
import { env } from "#/env.ts";
import { gracefulExit } from 'exit-hook'
import { sql, Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import type { DB } from "#/dbtypes.ts";

const bot = new Bot(env.TG_BOT_TOKEN);

export function createClient(url: string): Kysely<DB> {
    const client = postgres(url);

    const database = new Kysely<DB>({
        dialect: new PostgresJSDialect({
            postgres: client,
        }),
    });
    return database;
}

const db: { [key: string]: Kysely<DB> }  = {
    'prod': createClient(env.DB_PROD),
    'usEast': createClient(env.DB_US_EAST), 
    'usWest': createClient(env.DB_US_WEST),
    'euWest': createClient(env.DB_EU),
    'asiaEast': createClient(env.DB_ASIA)
}

async function listMetaBase(database: Kysely<DB>): Promise<number> {
    const query = sql<string>` SELECT * FROM public.efp_list_metadata WHERE chain_id = 8453`
    const result = await query.execute(database)
    return result.rows.length
}

async function listMetaOp(database: Kysely<DB>): Promise<number> {
    const query = sql<string>` SELECT * FROM public.efp_list_metadata WHERE chain_id = 10`
    const result = await query.execute(database)
    return result.rows.length
}

async function listMetaEth(database: Kysely<DB>): Promise<number> {
    const query = sql<string>` SELECT * FROM public.efp_list_metadata WHERE chain_id = 1`
    const result = await query.execute(database)
    return result.rows.length
}

async function lists(database: Kysely<DB>): Promise<number> {
    const query = sql<string>` SELECT * FROM public.efp_lists`
    const result = await query.execute(database)
    return result.rows.length
}

async function listOpEvents(database: Kysely<DB>): Promise<number> {
    const events = sql<string>`
        SELECT * 
        FROM public.events 
        WHERE events.event_name::text = 'ListOp'::text`
    const eventsResult = await events.execute(database)
    return eventsResult.rows.length
}

async function listRecordsBase(database: Kysely<DB>): Promise<number> {
    const listRecords = sql<string>`
        SELECT * 
        FROM public.efp_list_records
        WHERE chain_id = 8453`
    const listRecordsResult = await listRecords.execute(database)
    return listRecordsResult.rows.length
}

async function listRecordsOp(database: Kysely<DB>): Promise<number> {
    const listRecords = sql<string>`
        SELECT * 
        FROM public.efp_list_records
        WHERE chain_id = 10`
    const listRecordsResult = await listRecords.execute(database)
    return listRecordsResult.rows.length
}

async function listRecordsEth(database: Kysely<DB>): Promise<number> {
    const listRecords = sql<string>`
        SELECT * 
        FROM public.efp_list_records
        WHERE chain_id = 1`
    const listRecordsResult = await listRecords.execute(database)
    return listRecordsResult.rows.length
}

async function accountMeta(database: Kysely<DB>): Promise<number> {
    const query = sql<string>`
        SELECT * 
        FROM public.efp_account_metadata`
    const result = await query.execute(database)
    return result.rows.length
}

async function lSLUpdate(database: Kysely<DB>): Promise<number> {
    const query = sql<string>`
        SELECT * 
        FROM public.events 
        WHERE event_name = 'UpdateListStorageLocation'`
    const result = await query.execute(database)
    return result.rows.length
}

async function analyze(functionPointer: Function): Promise<any> {
    
    const props: { [key: string]: number } = {}
    let runningCount = 0
    for (const key in db) {
        console.log('Fetching Data...', key, functionPointer.name);
        const count = await functionPointer(db[key]);
        props[key] = count;
        runningCount += count
    }
    const averageCount = runningCount / Object.keys(props).length
    for(const key in props){
        if((props[key] - averageCount)!== 0){
            const message = `[DISCREPANCY] ${key} ${functionPointer.name} count: ${props[key]}`
            console.log(message)
            await bot.api.sendMessage(env.TG_CHAT_ID, message);
        }
    }
}

async function main(){
    // await analyze(listMeta);
    await analyze(lists);
    // await analyze(listOpEvents);
    await analyze(listRecordsBase);
    await analyze(listRecordsOp);
    await analyze(listRecordsEth);
  
    await analyze(listMetaBase);
    await analyze(listMetaOp);
    await analyze(listMetaEth);

    await analyze(accountMeta);
    await analyze(lSLUpdate);
}

main().then(() => {
    console.log('>>>DONE<<<')
    const estTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    console.log(estTime);
    gracefulExit()
}).catch((e) => {
    console.error(e)
})  
