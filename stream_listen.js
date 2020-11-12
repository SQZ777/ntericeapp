require('dotenv').config();

const {
    getRequest
} = require('./lib/request');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.channels.cache.get("776035789108543528").send(`${client.user.tag} 前來報到`);
    count = 0
    setInterval(() => {
        if (count < 3) {
            client.channels.cache.get("776035789108543528").send("測試一下每三秒傳一次訊息傳三次");
            count++;
        }
    }, 3000);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    }
});


client.login(process.env.discordToken);