const Discord = require('discord.js');
const bot = new Discord.Client();
const db = require('quick.db')
const prettyMilliseconds = require('pretty-ms');
const footer ="discord bot kodları ve altyapıları için http://www.discordbotkodlari.online"

exports.run = async (client, message) => {
        let user = message.mentions.users.first() || message.author
        let bal = db.fetch(`Voice.${message.guild.id}.${user.id}`)
        let TopMsg = db.all(`Msg.${message.guild.id}`)
        let mesaj = db.get(`message.${message.author.id}`)
      TopMsg.sort((a, b) => {
        return b.data - a.data
      })

      
      let BalID = TopMsg.map((g) => g.ID.split("_")[2])

      
      let TopUser = BalID.indexOf(user.id)+1
      if(bal === undefined) bal = "0 (henüz sunucuda sesiniz yok)"
      if(!TopUser) TopUser = "(Siz sıralamada değilsiniz)"
  
        let embed = new Discord.RichEmbed()
        .setTitle("İşte sunucudaki ses açısından ilerlemeniz")
        .setDescription(`
        

> > **Toplam Aktiflik**
> ${prettyMilliseconds(bal)}
> > **Toplam Mesaj**
> ${mesaj}
> > **Sıralamadaki yeriniz**
> ${TopUser}

`)
    .setColor("RANDOM")
    .setThumbnail(`${user.displayAvatarURL}`)
    .setFooter(footer)
  
         return message.channel.send(embed)

};

exports.conf = {
  enabled: true,
  aliases: ["me","süre"],
  permLevel: 0,
};

exports.help = {
  name: "info",
  description: "",
  usage: "info",
};