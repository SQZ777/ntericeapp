require('dotenv').config();

const {
    getRequest
} = require('./lib/request');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // client.channels.cache.get("776035789108543528").send(`${client.user.tag} 前來報到`);
    
    setInterval(() => {
    }, 3000);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    }
});


client.login(process.env.discordToken);