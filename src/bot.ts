import { Bot } from "grammy";
import { env } from "#/env.ts";
import { consensus } from "#/commands/consensus";

// Create a bot object
const bot = new Bot(env.TG_BOT_TOKEN);

function isAuthorized(ctx: any) {
    return ctx.from.id === parseInt(env.TG_ADMIN_ID)
}

bot.command("con", async (ctx: any) => {
    if (!isAuthorized(ctx)) {
        return
    }
    await consensus(ctx)
});
// // Register listeners to handle messages
// bot.on("message:text", async (ctx: any, next: any) => {
//     ctx.reply("Echo: " + ctx.message.text)
//     console.log(ctx.message)
//     await next()
// });


// Start the bot (using long polling)
console.log("Starting bot...");
bot.api.sendMessage(env.TG_CHAT_ID, "all systems operational, good morning");

bot.catch(err => console.error(err))
bot.start();