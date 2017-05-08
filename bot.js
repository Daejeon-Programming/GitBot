'use strict';

var bot = (function () {
  var exp = {};
  
  const discord = require('discord.js');
  
  exp.init = function init(config) {
    this.client = new discord.Client();
    this.token = config.token;
    this.guild = config.guild;
    this.channel= config.channel;
    
    this.client.on('ready', function() {
      this.guild = this.client.guilds.find('name', this.guild);
      this.channel = this.guild.channels.find('name', this.channel);
      console.log('BobbyBot: I am ready!');
    }.bind(this));
    
    this.client.login(this.token);
  }

  exp.setPing = function setPing(bool) { //can be used for test purpose
    if (bool) {
      this.client.on('message', function(message) {
        if (message.content === 'ping') {
          message.reply('pong');
        }
      }.bind(this));
      console.log('ping: on');
    } else {
      this.client.removeAllListeners('message'); //FIXME might be too much removal
      console.log('ping: off');
    }
  }

  exp.sendMessage = function sendMessage(text) {
    this.channel.send(text);
  }
  
  return exp;
})();

module.exports = bot;