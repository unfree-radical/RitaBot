// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
const censorjs = require("censorjs");
const wash = require("washyourmouthoutwithsoap");

// -------------------
// Detect if bad words
// -------------------

function detect (data)
{

   const text = data.translate.text;
   const result = censorjs.check(text);
   if (result === true)
   {

      return true;

   }

   return false;

}

function profanityFilter (data)
{

   try
   {

      if (data.message.server[0].badwords === "replace")
      {

         // ----------------
         // Replace Badwords
         // ----------------

         const langTo = data.translate.to.unique[0];
         const wordList = wash.words(langTo);

         if (wordList === undefined)
         {

            return;

         }

         censorjs.setWordList(wordList);
         censorjs.clean(data.text);

      }
      // else if (data.message.server[0].badwords === "delete")
      // {

      // deletion code here

      // }
      console.log("DEBUG: This line should not trigger");

   }
   catch (err)
   {

      console.log(`ERROR: Send Error, profanity.js = Line ????- SERVER: ${data.message.guild.id}`);

   }

}


module.exports =
{detect,
   profanityFilter};
