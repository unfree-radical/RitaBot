// -----------------
// Global variables
// Err TAG: RS009??
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable consistent-return */
const logger = require("./logger");

// --------------------------------------
// Helper Functions & Buffer end checker
// --------------------------------------

exports.bufferEnd = function bufferEnd (arrOriginal, arrFinal)
{

   if (arrOriginal.length === arrFinal.length)
   {

      return true;

   }
   return false;

};

// ----------------------
// Check user permission
// ----------------------

exports.checkPerm = function checkPerm (member, channel, perm)
{

   return channel.permissionsFor(member).has(perm);

};

// ------------------------------------
// Get key name of object by its value
// ------------------------------------

exports.getKeyByValue = function getKeyByValue (object, value)
{

   return Object.keys(object).find((key) => object[key] === value);

};

// -----------------------------
// Remove duplicates from array
// -----------------------------

exports.removeDupes = function removeDupes (array)
{

   return Array.from(new Set(array));

};

// ------------------------------
// Replace all matches in string
// ------------------------------

exports.replaceAll = function replaceAll (str, search, replacement)
{

   return str.replace(
      new RegExp(
         search,
         "g"
      ),
      replacement
   );

};

// ---------------------------
// Sort array by specific key
// ---------------------------

exports.sortByKey = function sortByKey (array, key)
{

   return array.sort(function sort (a, b)
   {

      const x = a[key];
      const y = b[key];
      return x < y ?
         -1 :
         x > y ?
            1 :
            0;

   });

};

// -----------------------------------
// Split string to array if not array
// -----------------------------------

exports.arraySplit = function arraySplit (input, sep)
{

   if (input.constructor === Array && input.length > 0)
   {

      return input;

   }
   return input.split(sep);

};

// -----------------------
// Split string to chunks
// -----------------------

exports.chunkString = function chunkString (str, len)
{

   const _size = Math.ceil(str.length / len);
   const _ret = new Array(_size);
   let _offset = null;

   for (let _i = 0; _i < _size; _i += 1)
   {

      _offset = _i * len;
      _ret[_i] = str.substring(
         _offset,
         _offset + len
      );

   }

   return _ret;

};

// ----------------------------------
// Get sum of array values (numbers)
// ----------------------------------

exports.arraySum = function arraySum (array)
{

   return array.reduce(
      (a, b) => a + b,
      0
   );

};

// -----------------------
// Get Highest Role Color
// -----------------------

exports.getRoleColor = function getRoleColor (member)
{

   if (member)
   {

      return member.displayColor;

   }
   return null;

};

// ---------
// Get user
// ---------

exports.getUser = function getUser (client, userID, cb)
{

   const user = client.users.cache.get(userID);

   if (user)
   {

      return cb(user);

   }

   // User not in cache, fetch 'em

   client.users.fetch(userID).then(cb).
      catch((err) =>
      {

         cb(false);
         return logger(
            "error",
            err
         );

      });

};

// ------------
// Get channel
// ------------

exports.getChannel = function getChannel (client, channelId, userID, cb)
{

   const channel = client.channels.cache.get(channelId);

   if (channel)
   {

      return cb(channel);

   }

   // Not in cache, create DM

   if (userID)
   {

      module.exports.getUser(
         client,
         userID,
         (user) =>
         {

            user.createDM().then(cb).
               catch((err) =>
               {

                  cb(false);
                  return logger(
                     "error",
                     err
                  );

               });

         }
      );

   }

};

// ------------
// Get message
// ------------

exports.getMessage = function getMessage (client, messageID, channelId, userID, cb)
{

   module.exports.getChannel(
      client,
      channelId,
      userID,
      (channel) =>
      {


         // Message not in channel cache

         channel.messages.fetch(messageID).then(cb).
            catch((err) => cb(
               null,
               err
            ));

      }
   );

};

exports.getUserPin = function getUserPin (UID, cb)
{

   let pin = null;

   // --------
   // Stage 1
   // Split the UID in to an array of numbers.
   // EXAMPLE: UID - 438926745797877758
   // RESULT: 4 3 8 9 2 6 7 4 5 7 9 7 8 7 7 7 5 8
   // --------

   const stage1 = UID.split("");

   // --------
   // Stage 2
   // Sum Each set of 3 numbers, from start to finish, to create a new number.
   // EXAMPLE: 4 3 8 9 2 6 7 4 5 7 9 7 8 7 7 7 5 8
   // RESULT: 15 17 16 23 22 20
   // --------

   const calc1 = [];

   calc1[0] = Number(stage1[0]) + Number(stage1[1]) + Number(stage1[2]);
   calc1[1] = Number(stage1[3]) + Number(stage1[4]) + Number(stage1[5]);
   calc1[2] = Number(stage1[6]) + Number(stage1[7]) + Number(stage1[8]);
   calc1[3] = Number(stage1[9]) + Number(stage1[10]) + Number(stage1[11]);
   calc1[4] = Number(stage1[12]) + Number(stage1[13]) + Number(stage1[14]);
   calc1[5] = Number(stage1[15]) + Number(stage1[16]) + Number(stage1[17]);

   // --------
   // Stage 3
   // Now Split each number down to single digits and store in new array. If the result of stage 2 is a single digit pad with a 0 at he begining
   // EXAMPLE: 15 17 16 23 22 20
   // RESULT: 1 5 1 7 1 6 2 3 2 2 2 0
   // --------

   const stage2 = [];
   let temp = null;

   temp = calc1[0].toString().split("");
   if (temp.length < 2)
   {

      stage2[0] = "0";
      stage2[1] = temp[0];
      // console.log("<2");

   }
   else
   {

      stage2[0] = temp[0];
      stage2[1] = temp[1];

   }

   temp = calc1[1].toString().split("");
   if (temp.length < 2)
   {

      stage2[2] = "0";
      stage2[3] = temp[0];
      // console.log("<2");

   }
   else
   {

      stage2[2] = temp[0];
      stage2[3] = temp[1];

   }


   temp = calc1[2].toString().split("");
   if (temp.length < 2)
   {

      stage2[4] = "0";
      stage2[5] = temp[0];
      // console.log("<2");

   }
   else
   {

      stage2[4] = temp[0];
      stage2[5] = temp[1];

   }

   temp = calc1[3].toString().split("");
   if (temp.length < 2)
   {

      stage2[6] = "0";
      stage2[7] = temp[0];
      // console.log("<2");

   }
   else
   {

      stage2[6] = temp[0];
      stage2[7] = temp[1];

   }

   temp = calc1[4].toString().split("");
   if (temp.length < 2)
   {

      stage2[8] = "0";
      stage2[9] = temp[0];
      // console.log("<2");

   }
   else
   {

      stage2[8] = temp[0];
      stage2[9] = temp[1];

   }

   temp = calc1[5].toString().split("");
   if (temp.length < 2)
   {

      stage2[10] = "0";
      stage2[11] = temp[0];
      // console.log("<2");

   }
   else
   {

      stage2[10] = temp[0];
      stage2[11] = temp[1];

   }

   // --------
   // Stage 4
   // Sum Each set of 3 numbers, from start to finish, to create a new number.
   // EXAMPLE: 1 5 1 7 1 6 2 3 2 2 2 0
   // RESULT: 7 14 7 4
   // --------

   const calc2 = [];
   calc2[0] = Number(stage2[0]) + Number(stage2[1]) + Number(stage2[2]);
   calc2[1] = Number(stage2[3]) + Number(stage2[4]) + Number(stage2[5]);
   calc2[2] = Number(stage2[6]) + Number(stage2[7]) + Number(stage2[8]);
   calc2[3] = Number(stage2[9]) + Number(stage2[10]) + Number(stage2[11]);

   // --------
   // Stage 5
   // Same as stage 3 Split each number down to single digits and store in new array. If the result of stage 2 is a single digit pad with a 0 at he begining
   // EXAMPLE: 7 14 7 4
   // RESULT: 0 7 1 4 0 7 0 4
   // --------

   const stage3 = [];
   temp = null;

   temp = calc2[0].toString().split("");
   if (temp.length < 2)
   {

      stage3[0] = "0";
      stage3[1] = temp[0];
      // console.log("<2");

   }
   else
   {

      stage3[0] = temp[0];
      stage3[1] = temp[1];

   }


   temp = calc2[1].toString().split("");
   if (temp.length < 2)
   {

      stage3[2] = "0";
      stage3[3] = temp[0];
      // console.log("<2");

   }
   else
   {

      stage3[2] = temp[0];
      stage3[3] = temp[1];

   }


   temp = calc2[2].toString().split("");
   if (temp.length < 2)
   {

      stage3[4] = "0";
      stage3[5] = temp[0];
      // console.log("<2");

   }
   else
   {

      stage3[4] = temp[0];
      stage3[5] = temp[1];

   }


   temp = calc2[3].toString().split("");
   if (temp.length < 2)
   {

      stage3[6] = "0";
      stage3[7] = temp[0];
      // console.log("<2");

   }
   else
   {

      stage3[6] = temp[0];
      stage3[7] = temp[1];

   }

   // --------
   // Stage 6
   // Sum Each set of 2 numbers, from start to finish, to create a new number. you should now be left with 4 numbers.
   // EXAMPLE: 0 7 1 4 0 7 0 4
   // RESULT: 7 5 7 4
   // --------

   const calc3 = [];
   calc3[0] = Number(stage3[0]) + Number(stage3[1]);
   calc3[1] = Number(stage3[2]) + Number(stage3[3]);
   calc3[2] = Number(stage3[4]) + Number(stage3[5]);
   calc3[3] = Number(stage3[6]) + Number(stage3[7]);

   // ------------
   // Final Stage
   // Join the number together to make 1 single number, it should be 4 digits long but can be 5.
   // EXAMPLE: 7 5 7 4
   // RESULT: 7574
   // ------------

   pin = calc3.join("");

   // console.log(`DEBUG: User PIN is ${pin}`);
   // data.message.channel.send(`User PIN is: ${pin}`);

   return cb(pin);

};
