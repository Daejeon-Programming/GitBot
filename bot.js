'use strict';

var bot = (function () {
  var exp = {};
  
  const discord = require('discord.js');
  
  var client;
  var token;
  var guild;
  var channel;
  
  function init(config) {
    client = new discord.Client();
    
    client.on('ready', function() {
      guild = client.guilds.find('name', config.guild);
      channel = guild.channels.find('name', config.channel);
      console.log('BobbyBot: I am ready!');
    }.bind(this));
    
    client.login(config.token);
  }

  function setPing(bool) { //can be used for test purpose
    if (bool) {
      client.on('message', function(message) {
        if (message.content === 'ping') {
          message.reply('pong');
        }
      }.bind(this));
      console.log('ping: on');
    } else {
      client.removeAllListeners('message'); //FIXME might be too much removal
      console.log('ping: off');
    }
  }

  function sendMessage(text) {
    channel.send(text);
  }
  
  function setChannel(channel) {
    channel = guild.channels.find('name', channel);
  }
  
  return {
    init,
    setPing,
    sendMessage,
  }
  
  return exp;
})();

module.exports = bot;