'use strict';

//init env variables from .env
require('dotenv').config()

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var bot = require('./bot.js');
var gitListener = require('./gitEvent.js');

var port = process.env.PORT || 2012; //TODO set NODE_ENV environement variable
var botConfig = {
  token: process.env.BOT_TOKEN,
  guild: 'Daejeon programming',
  channel: 'bot-test',
};


bot.init(botConfig);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // needed for express.js

gitListener.listen(app, function(message) {
  console.log(message[1]); //should be 'new /event-type/ event received :
  bot.sendMessage(message);
});

app.listen(port, function () {
  console.log('Example app listening on port ' + port + '!');
});
