 require('dotenv').config()
const express = require("express")
const app = express()
app.get("/", async(req, res) => {
  res.sendStatus(200)
})
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server Started Serving on port: ${PORT}`)
})
const {Client, MessageEmbed} = require('discord.js');
const { token } = process.env;
const config = require('./config.json')
const ms = require('pretty-ms')
const client = new Client({
    intents: ["GUILDS",
    
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILD_MESSAGE_TYPING",
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "DIRECT_MESSAGE_TYPING"],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    restTimeOffset: 0,
    allowedMentions: {
        parse: ['users']
    }
})

client.on('messageCreate', async message => {
    if(message.author.bot) return;
    if(message.content.toLowerCase() === ".ping") {
      const l = await message.channel.send('Pinging...')
      const ping = l.createdTimestamp - message.createdTimestamp
      await l.edit(`Pong! (Websocket: ${client.ws.ping}ms. Roundtrip: ${ping}ms.)`)
    }
    if(message.content.toLowerCase() === ".uptime") {
  return message.channel.send(`I have been running for: ${ms(client.uptime)}`)
    }
    if(message.channel.id === config.channel) {
      if(message.content.length > 75) {
        await message.delete()
        const msg = await message.channel.send(`<@${message.author.id}> Your message is too long try making it shorter (you can describe it more inside the thread)`)
        setTimeout( async () => {
          await msg.delete()
          
        }, 5000)

        return;
      }
        const embed = new MessageEmbed()
        .setTitle('Welcome to Curiopost')
        .setDescription('Please Send a message below describing your bug and wait for me to open a thread!')
        .setTimestamp()
        .setColor("RANDOM")
        const embed2 = new MessageEmbed()
        .setTitle(`Welcome to bug reports ${message.author.username}`)
        .setDescription('Please Explain your bug here, and wait for a developer to respond. If this bug is resolved please archive this thread by typing `.archive`')
        .setTimestamp()
        .setColor("RANDOM")
        await message.channel.bulkDelete(2, true)
       const thread =  await message.channel.threads.create({
            name:  `${message.content} | ${message.author.id}`,
            autoArchiveDuration: 10080,
            reason: 'Bug Report'
        })
        if (thread.joinable) await thread.join();
        await thread.members.add(message.author.id);
        thread.send({embeds: [embed2]})
        message.channel.send({embeds: [embed]})
    }
})

client.on('messageCreate', async message => {
  if(message.author.bot) return;
  if(message.channel.id === config.support_channel) {
    if(message.content.length > 75) {
      await message.delete()
      const msg = await message.channel.send(`<@${message.author.id}> Your message is too long try making it shorter (you can describe it more inside the thread)`)
      setTimeout( async () => {
        await msg.delete()
        
      }, 5000)

      return;
    }
      const embed = new MessageEmbed()
      .setTitle('Welcome to Curiopost')
      .setDescription('Please Send a message below describing what support you need and wait for me to open a thread!')
      .setTimestamp()
      .setColor("RANDOM")
      const embed2 = new MessageEmbed()
      .setTitle(`Welcome to bug reports ${message.author.username}`)
      .setDescription('Please Explain your problem here, and wait for a developer to respond. If this is resolved please archive this thread by typing `.archive`')
      .setTimestamp()
      .setColor("RANDOM")
      await message.channel.bulkDelete(2, true)
     const thread =  await message.channel.threads.create({
          name:  `${message.content} | ${message.author.id}`,
          autoArchiveDuration: 10080,
          reason: 'Support Question'
      })
      if (thread.joinable) await thread.join();
      await thread.members.add(message.author.id);
      thread.send({embeds: [embed2]})
      message.channel.send({embeds: [embed]})
  }
})


client.on('messageCreate', async message => {
    if(message.author.bot) return;
    if(message.channel.type !== 'GUILD_PUBLIC_THREAD') return;
    if(message.content === '.archive') {
        if(message.channel.name.endsWith(message.author.id)) {
            await message.channel.send("Archived Thread.")
          await message.channel.setLocked(true);
            await message.channel.setArchived(true);
           
    } else {
        message.channel.send('You can only archive your own thread!')
  
      
    }
}
})


client.on('ready', () => {
    console.log("Bot is ready!")
})
client.login(token);
