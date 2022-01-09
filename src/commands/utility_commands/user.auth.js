// -----------------
// Global variables
// Err TAG: RC509??
// -----------------

// Codebeat:disable[LOC,ABC,BLOCK_NESTING,ARITY]
/* eslint-disable no-unused-vars */
/* eslint-disable no-multiple-empty-lines */
const sendMessage = require("../../core/command.send");
const fs = require("fs");
const path = require("path");
const auth = require("../../core/auth");
const fn = require("../../core/helpers");


// ----------
// Core Code
// ----------

module.exports = function run (data)
{


   fn.getUserPin(data.cmd.num, (pin) =>
   {

      // console.log(`DEBUG: ${pin}`);
      data.message.channel.send(`User pin is: ${pin}`);

   });

};

