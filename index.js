const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const bot = new Discord.Client({disableEveryone: true});
const ms = require("ms");
const fs = require("fs");
const DBL = require("dblapi.js");
const dbl = new DBL('API_Key', bot);
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
const talkedRecently = new Set();
const mongoose = require("mongoose");
mongoose.connect('mongo_password', {
  useNewUrlParser: true
});
const Money = require("./models/money.js")



fs.readdir("./commands/", (err, files) =>{

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find Commands");
    return;
  }

    jsfile.forEach((f, i) =>{
      let props = require(`./commands/${f}`);
      console.log(`${f} loaded!`);
      bot.commands.set(props.help.name, props);
      props.help.aliases.forEach(alias => {
      bot.aliases.set(alias, props.help.name);
      });
    });

});


//Playing status
bot.on("ready", async () => {

  let ASCII = ["( ͡° ͜ʖ ͡°)","¯\_(ツ)_/¯","̿̿ ̿̿ ̿̿ ̿'̿'\̵͇̿̿\з= ( ▀ ͜͞ʖ▀) =ε/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿","▄︻̷̿┻̿═━一","ಠ_ಠ","(づ｡◕‿‿◕｡)づ","(ಥ﹏ಥ)","[̲̅$̲̅(̲̅5̲̅)̲̅$̲̅]","(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧","♥‿♥","(╯°□°）╯︵ ┻━┻","◉_◉","ヾ(⌐■_■)ノ♪","ᕦ(ò_óˇ)ᕤ","⚆ _ ⚆","(｡◕‿‿◕｡)","(｡◕‿◕｡)","☜(⌒▽⌒)☞","｡◕‿◕｡","¯\(°_o)/¯","(ʘ‿ʘ)","ლ,ᔑ•ﺪ͟͠•ᔐ.ლ","ʘ‿ʘ","◔ ⌣ ◔","^̮^",">_>","(▰˘◡˘▰)"];

  var serverList = bot.guilds.array();

    let randoServ = serverList[Math.floor(Math.random() * serverList.length)];
    let asciiFaces = ASCII[Math.floor(Math.random() * ASCII.length)];
  setInterval(() => {

    let Status = [
        `with ${bot.users.size} users | !help | ${asciiFaces}`,
        `with ${bot.guilds.size} servers | !help | ${asciiFaces}`,
        'with coins | !help',
        'with SamBro2901 | !help',
        `in ${randoServ} | !help`
    ];
 bot.user.setActivity(Status[Math.floor(Math.random() * Status.length)], { "type": "PLAYING" });
    bot.user.setStatus('online');
}, 45 * 1000);

  setInterval(() => {
    dbl.postStats(bot.guilds.size);
    console.log("Server Count Posted!(Discord Bot List)");
  }, 1800000);

  console.log(`${bot.user.username} is online`);
});


bot.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (ID: ${guild.id}). This server houses ${guild.memberCount} users.`);
  let Sicon = guild.iconURL;
  let guildEmbed = new Discord.RichEmbed()
  .setTitle("New Server joined!")
  .setColor("#53f23e")
  .setThumbnail(Sicon)
  .addField("__**Guild Name:**__", `${guild.name}`)
  .addField("__**Guild Owner:**__", `${guild.owner} [${guild.owner.user.tag}]`)
  .addField("__**Guild Size:**__", `${guild.memberCount}`)
  .addField("__**Now serving:**__", `${bot.guilds.size} servers`)
  .setFooter(`Guild ID: ${guild.id}`)
  .setTimestamp();
  bot.channels.get("530634909711073292").send(guildEmbed);
})

bot.on("guildDelete", guild => {
  console.log(`Removed from: ${guild.name} (ID: ${guild.id}). This server housed ${guild.memberCount} users.`);
  let Sicon = guild.iconURL;
  let guildEmbed = new Discord.RichEmbed()
  .setTitle("Left a server 🙁")
  .setColor("#ff0000")
  .setThumbnail(Sicon)
  .addField("__**Guild Name:**__", `${guild.name}`)
  .addField("__**Guild Owner:**__", `${guild.owner} [${guild.owner.user.tag}]`)
  .addField("__**Guild Size:**__", `${guild.memberCount}`)
  .addField("__**Now serving:**__", `${bot.guilds.size} servers`)
  .setFooter(`Guild ID: ${guild.id}`)
  .setTimestamp();
  bot.channels.get("530634909711073292").send(guildEmbed);
})

bot.on("message", async message => {

  if(!message.channel.permissionsFor(bot.user).has("SEND_MESSAGES")) return;
  if(message.isMentioned(bot.user)){
    let iURL = message.author.avatarURL;
    let helpEmbed = new Discord.RichEmbed()
    .setAuthor(message.author.tag, iURL)
    .setColor("#12c3ea")
    .setDescription(`Hey ${message.author.username}! My prefix is \`!\`.\nType \`!help\` to get a basic list of commands.`)
    .setTimestamp();
    message.channel.send(helpEmbed);
  }
})

bot.on("message", async message =>{
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  if(!message.channel.permissionsFor(bot.user).has("SEND_MESSAGES")) return;
  

  let prefix = botconfig.prefix;

   //Cooldown
   let coolEmbed = new Discord.RichEmbed()
   .setTitle("Slowdown!")
   .setColor("#FF0000")
   .setDescription(`<@${message.author.id}>, Please wait for 3 seconds before using the command again.`);
   if(!message.content.startsWith(prefix)) return;
   if (talkedRecently.has(message.author.id)) {
    message.delete();
    message.reply(coolEmbed);
    return;
  }

  talkedRecently.add(message.author.id);
  setTimeout(() => {
    talkedRecently.delete(message.author.id);
  }, 3000);

  let args = message.content.slice(prefix.length).trim().split(' ');
let cmd = args.shift().toLowerCase();
let command;

if (bot.commands.has(cmd)) {
    command = bot.commands.get(cmd);
} else if (bot.aliases.has(cmd)) {
    command = bot.commands.get(bot.aliases.get(cmd));
}
try {
  console.log(`Running "${cmd}" in ${message.guild.name} in the channel #${message.channel.name}`);
    command.run(bot, message, args, command);
} catch (e) {
    return;
}



});

bot.login(SECRET_TOKEN);
