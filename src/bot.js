// -----------------
// Global variables
// Err TAG: RB001??
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING]
/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
/* eslint-disable sort-keys */
const fs = require("fs");
const time = {
   "long": 60000,
   "mid": 30000,
   "short": 5000
};

const path = `${__dirname.slice(0, -3)}`;


if (fs.existsSync(`${path}.env`))
{

   // console.log("main env exists");
   const env = `${path}.env`;
   module.require("dotenv").config({
      "path": env
   });
   console.log("----------------------------------------\n.env file loaded");

}
else if (fs.existsSync(`${path}.env.json`))
{

   // console.log("json env exists");
   const env = `${path}.env.json`;
   module.require("dotenv-json")({
      "path": env
   });
   console.log("----------------------------------------\n.env.json file loaded");

}


// const dotenvJSON = require("dotenv-json");
// const envJson = `${__dirname.slice(
//   0,
//   -3
// )}.env.json`;
// dotenvJSON({"path": envJson});

const {Client, Options, Intents} = require("discord.js-light");

const myIntents = new Intents(32509);

const client = new Client({
   "restRequestTimeout": time.long,
   "shards": "auto",
   "makeCache": Options.cacheWithLimits({
      "ApplicationCommandManager": 0, // guild.commands
      "BaseGuildEmojiManager": Infinity, // guild.emojis
      "ChannelManager": Infinity, // client.channels
      "GuildChannelManager": Infinity, // guild.channels
      "GuildBanManager": 15, // guild.bans
      "GuildInviteManager": 15, // guild.invites
      "GuildManager": Infinity, // client.guilds
      "GuildMemberManager": Infinity, // guild.members
      "GuildStickerManager": 15, // guild.stickers
      "GuildScheduledEventManager": 15, // guild.scheduledEvents
      "MessageManager": 15, // channel.messages
      // "PermissionOverwriteManager": 15, // channel.permissionOverwrites
      "PresenceManager": 15, // guild.presences
      "ReactionManager": 15, // message.reactions
      "ReactionUserManager": 15, // reaction.users
      // "RoleManager": 15, // guild.roles
      "StageInstanceManager": 15, // guild.stageInstances
      "ThreadManager": 15, // channel.threads
      "ThreadMemberManager": 15, // threadchannel.members
      "UserManager": Infinity, // client.users
      "VoiceStateManager": 15 // guild.voiceStates
   }),
   "intents": myIntents,
   "waitGuildTimeout": 7000
});
const auth = require("./core/auth");

/*
const {AutoPoster} = require("topgg-autoposter");

// your discord.js or eris client
const topggLogin = auth.topggToken;
if (!topggLogin || topggLogin === " ")
{

   console.log("----------------------------------------\nNo top.gg token present");

}
else
{

   // eslint-disable-next-line new-cap
   const poster = AutoPoster(topggLogin, client);
   // optional
   poster.on("posted", (stats) =>
   // ran when succesfully posted
   {

      console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`);

   });

}
*/

// ---------------
// Event Listener
// ---------------

const events = require("./events");

events.listen(client);
exports.client = client;
// ---------------
// Initialize Bot
// ---------------

// eslint-disable-next-line func-style
function login (token)
{

   client.login(token).catch((err) =>
   {

      console.log(err);
      console.log(`retrying login...`);
      setTimeout(
         login,
         5000
      );

   });

}

login(auth.token);
