// -----------------
// Global variables
// -----------------

// codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
const fn = require("../../core/helpers");
const translate = require("../../core/translate");
const logger = require("../../core/logger");
const colors = require("../../core/colors");
const discord = require("discord.js");
//const botSend = require("../../core/send");

const getCount = function(count)
{
   if (count)
   {
      return count;
   }
   return "-1";
};

// ---------------
// Translate last
// ---------------

module.exports = function(data)
{
   // -------------------------
   // Prepare translation data
   // -------------------------

   data.translate = {
      to: data.cmd.to,
      from: data.cmd.from
   };

   // ----------------
   // Get count param
   // ----------------

   var count = getCount(data.cmd.num);

   // ---------
   // Set mode
   // ---------

   var mode = "all";

   if (count.startsWith("-") || count === "1")
   {
      mode = "single";
      data.translate.multi = true;
   }

   if (mode === "all" && Math.abs(count) > data.config.maxChains)
   {
      data.color = "warn";
      data.text =
            ":warning:  Cannot translate more than __**`" +
            data.config.maxChains + "`**__ message chains at once.";

      // -------------
      // Send message
      // -------------

      sendMessage(data);
      count = data.config.maxChains;
   }

   // -------------------------
   // Get requested collection
   // -------------------------

   var limit = Math.abs(count) * data.config.maxChainLen + 1;

   if (limit > 100)
   {
      limit = 100;
   }

   data.message.channel.fetchMessages({
      limit: limit
   }).then(messages => //eslint-disable-line complexity
   {
      const messagesArray = messages.array().reverse();
      var lastAuthor;
      var chains = [];

      for (var i = 0; i < messagesArray.length; i++)
      {
         if (
            !messagesArray[i].author.bot &&
            !messagesArray[i].content.startsWith(data.config.translateCmdShort)
         )
         {
            if (
               lastAuthor === messagesArray[i].author.id &&
               chains[chains.length - 1].msgs.length < data.config.maxChainLen
            )
            {
               chains[chains.length - 1].msgs.push(messagesArray[i].content);
            }

            else
            {
               chains.push({
                  author: messagesArray[i].author,
                  msgs: [messagesArray[i].content],
                  time: messagesArray[i].createdTimestamp,
                  color: fn.getRoleColor(messagesArray[i].member)
               });
               lastAuthor = messagesArray[i].author.id;
            }
         }
      }

      // --------------------------
      // Get requested chains only
      // --------------------------

      const reqChains = chains.slice(-Math.abs(count));

      // --------------------------
      // Error - No messages found
      // --------------------------

      if (reqChains.length < 1)
      {
         data.color = "warn";
         data.text =
            ":warning:  Could not find any valid messages to " +
            "translate. Bots and commands are ignored.";

         // -------------
         // Send message
         // -------------

         return sendMessage(data);
      }

      // -----------------------
      // Translate single chain
      // -----------------------

      if (mode === "single")
      {
         data.message.author = reqChains[0].author;
         data.translate.original = reqChains[0].msgs.join("\n");
         delete data.message.attachments;
         return translate(data);
      }

      // -----------------------------------
      // Translate multiple chains (buffer)
      // -----------------------------------

      data.bufferChains = reqChains;
      delete data.message.attachments;
      return translate(data);
   }).catch(err => logger("error", err));
};

// ----------------------
// Send message function
// ----------------------

function sendMessage (data)
{
   data.message.delete(5000).catch(err => console.log("Command Message Deleted Error, translate.last.js = ", err));
   const richEmbedMessage = new discord.RichEmbed()
      .setColor(colors.get(data.color))
      .setAuthor(data.bot.username, data.bot.displayAvatarURL)
      .setDescription(data.text)
      .setTimestamp()
      .setFooter("This message will self-destruct in one minute");

   return data.message.channel.send(richEmbedMessage).then(msg =>
   {
      msg.delete(60000).catch(err => console.log("Bot Message Deleted Error, translate.last.js = ", err));
   });
}