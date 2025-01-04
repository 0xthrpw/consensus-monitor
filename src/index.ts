import { Bot } from "grammy";
import { env } from "#/env.ts";
import { gracefulExit } from 'exit-hook'

import { getDeploymentID, redeployService, updateVariable } from "./railway";
import { evmClients } from "./clients";

import { accountMeta, getClients, listMetaBase, 
    listMetaEth, listMetaOp, listRecordsBase, 
    listRecordsEth, listRecordsOp, lists, lSLUpdate } from "./model";

const bot = new Bot(env.TG_BOT_TOKEN);

const db = getClients();

const environmentIds: { [key: string]: string } = {
    'prod': env.ENV_ID_PROD,
    'usEast': env.ENV_ID_US_EAST,
    'usWest': env.ENV_ID_US_WEST,
    'euWest': env.ENV_ID_EU_WEST,
    'asiaEast': env.ENV_ID_ASIA_EAST
}

async function analyze(functionPointer: Function, chain: keyof typeof evmClients, serviceID: string): Promise<any> {
    
    const props: { [key: string]: number } = {}
    let runningCount = 0
    for (const key in db) {
        console.log('Fetching Data...', key, functionPointer.name);
        const count = await functionPointer(db[key]);
        props[key] = count;
        runningCount += count
        console.log(count);
    }
    const averageCount = runningCount / Object.keys(props).length
    for(const key in props){
        if(props[key] < averageCount){
            const message = `[DISCREPANCY] ${key} ${functionPointer.name} count: ${props[key]}`
            console.log(message)
            await bot.api.sendMessage(env.TG_CHAT_ID, message);

            // lookup block number 
            const client = evmClients[chain]()
            const blockNumber = await client.getBlockNumber();
            const newBlockNumber = blockNumber - 4000n;
            const envID = environmentIds[key];
            
            // update service variables to reflect new block number
            await updateVariable('START_BLOCK', newBlockNumber.toString(), serviceID, envID);
            
            // get deployment ID
            const deploymentID = await getDeploymentID(serviceID, envID);

            // trigger redeployment 
            await redeployService(deploymentID);
            await bot.api.sendMessage(env.TG_CHAT_ID, `Redeployed indexer:${chain} ${key} ${deploymentID}...`);
        }
    }
}

async function main(){
    await analyze(lists, '8453', env.SERVICE_PRIMARY_INDEXER_BASE);
    await analyze(listRecordsBase, '8453', env.SERVICE_PRIMARY_INDEXER_BASE);
    await analyze(listRecordsOp, '10', env.SERVICE_LIST_RECORDS_OP);
    await analyze(listRecordsEth, '1', env.SERVICE_LIST_RECORDS_ETH);
    await analyze(listMetaBase, '8453', env.SERVICE_PRIMARY_INDEXER_BASE);
    await analyze(listMetaOp, '10', env.SERVICE_LIST_RECORDS_OP);
    await analyze(listMetaEth, '1', env.SERVICE_LIST_RECORDS_ETH);
    await analyze(accountMeta, '8453', env.SERVICE_PRIMARY_INDEXER_BASE);
    await analyze(lSLUpdate, '8453', env.SERVICE_PRIMARY_INDEXER_BASE);
}

main().then(() => {
    console.log('>>>DONE<<<')
    const estTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    console.log(estTime);
    gracefulExit()
}).catch((e) => {
    console.error(e)
})  
