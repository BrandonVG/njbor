const key = require("./key.js");
const Discord = require("discord.js");
const bot = new Discord.Client();
const music = require("./modules/music.js");
const prefix = ":";
bot.login(key);
bot.on("message", async message =>{
    if (message.author.bot) return;
    let rndNumber = Math.ceil(Math.random() * 100);
    if (rndNumber <= 4){
        
        music(message);
    }
})