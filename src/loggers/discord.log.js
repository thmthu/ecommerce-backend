"use strict";
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});
const token ="MTM0NDIxOTM2NTQwMjIxNDQ1MQ.Gf0FJe.oHVychCGoLFAf9PHZ5770ssi3nOGIgnb2gykfU"
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});
client.login(token)