const Discord = require('discord.js');
//http://www.discordbotkodlari.online
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const db = require('quick.db');
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;
//http://www.discordbotkodlari.online
const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});


const footer ="discord bot kodları ve altyapıları için http://www.discordbotkodlari.online"

client.elevation = message => {
  if(!message.guild) {
	return; }//http://www.discordbotkodlari.online
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(ayarlar.token);

//http://www.discordbotkodlari.online
const ms = require('ms')

const DataVoice = new Map()

client.on("voiceStateUpdate", async(oldMember, newMember) => {
  if(oldMember.user.bot) return;
  newMember.guild = oldMember.guild
  let newUserChannel = newMember.voiceChannel
  let oldUserChannel = oldMember.voiceChannel
  if(oldUserChannel === undefined && newUserChannel !== undefined) {
    let bal = db.fetch(`Voice.${oldMember.guild.id}.${oldMember.user.id}`)

    if(bal === null) bal = 0

    DataVoice.set(oldMember.user.id, Date.now())
  }else if(oldUserChannel !== undefined && newUserChannel === undefined) {
    let total = (Date.now() - DataVoice.get(oldMember.user.id))
    console.log(total)

    db.add(`Voice.${oldMember.guild.id}.${oldMember.user.id}`, total)

  }
})

client.on("message", async(message) => {
  if(message.author.id === client.id) return;
  if (message.content.length < 1) return; 
db.add(`message.${message.author.id}`,1)
})

//http://www.discordbotkodlari.online