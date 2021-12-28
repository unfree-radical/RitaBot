// -----------------
// Global variables
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars */
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


   // ----------------
   // Replace Badwords
   // ----------------

   const wordList = wash.words(data.langTo);

   if (wordList === undefined)
   {

      return;

   }

   censorjs.setWordList(wordList);
   censorjs.clean(data.text);
   data.censored = true;


}

module.exports = function run (data)
{

   const profanity = data.message.server[0].badwords;
   console.log(`${[profanity]}`);
   try
   {

      if (profanity === "replace")
      {

         console.log(`DEBUG: Replace variable detected`);
         return profanityFilter(data);

      }
      else if (profanity === "delete")
      {

         console.log(`DEBUG: Delete variable detected`);
         return profanityFilter(data);

      }
      console.log("DEBUG: This line should not trigger");

   }
   catch (err)
   {

      console.log(`ERROR: Send Error, profanity.js = Line ????- SERVER: ${data.message.guild.id}`);

   }

};
