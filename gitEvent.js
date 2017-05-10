'use strict';

var gitListener = (function () {

  function listen (app, callback) {
    app.post('/', function (req, res) {
      if (req.headers['user-agent'] === 'GitHub-Hookshot/0878b99') { //TODO addmore security and checking + error handeling
        var message = writeMessage(req);
        callback(message);
      } 
      else {
        console.log('error: wrong sender');
      }
      res.send(message);
    });
  };

  function writeMessage(req) { //TODO improve message aspect + add links + handle more events
    var message = [];
    message.push('new ' + req.headers['x-github-event'] + ' event received :');
    var payload = JSON.parse(req.body.payload);
    var untested = 'this log template is new, if there is any mistake/aberration please let us know';
    switch (req.headers['x-github-event']) {
      case 'member':
        switch (payload.action) {
          case 'added':
            message.push('A new member have been added to ' + payload.repository.name + '.')
            message.push('Welcome ' + payload.member.login + '!');
            break;
          case 'deleted':
            message.push('A new member have been deleted from ' + payload.repository.name);
            message.push('Bye ' + payload.member.login + '!');
            break;
          case 'edited':
            message.push(payload.member.login + ' status in ' + payload.repository.name + ' has changed.');
            break;
        }
        message.push(untested); //to be deleted once the message have been used sucessfully
        break;
      case 'watch':
        message.push(payload.sender.login + ' started to watch ' + payload.repository.full_name);
        break;
      case 'fork':
        message.push(payload.sender.login + ' forked ' + payload.repository.full_name + '.');
        message.push(untested); //to be deleted once the message have been used sucessfully
        break;
      case 'push':
        message.push(payload.pusher.name + ' pushed in ' + payload.repository.full_name + ':');
        message.push('commits : (TODO: insert a list of the commits involved)');
        message.push(untested); //to be deleted once the message have been used sucessfully
        break;
      case 'pull_request':
        message = message.concat(pullReqMessage(payload));
        message.push(untested); //to be deleted once the message have been used sucessfully
        break;
      case 'commit_comment':
        message.push(payload.sender.login + ' commented a commit from ' + payload.repository.full_name + ':');
        message.push('comment :' + payload.comment.body);
        message.push(untested); //to be deleted once the message have been used sucessfully
        break;
      default:
        message.push('No detailed message have been wrote for this kind of event.');
        message.push('Feel free to write one and to pull a request on https://github.com/Daejeon-Programming/GitBot');
        message.push(untested); //to be deleted once the message have been used sucessfully
    }
    return message;
  }

  function pullReqMessage(payload) {
    var pullMessage = [];
    switch (payload.action) {
      case 'assigned':
        pullMessage.push('The pull request ' + payload.number + ' from ' + payload.repository.full_name + ' has been assigned to ' + payload.pull_request.assignee +'.');
        break;
      case 'unassigned':
        pullMessage.push('The pull request ' + payload.number + ' from ' + payload.repository.full_name + ' has been unassigned.');
        break;
      case 'review_requested':
        pullMessage.push(payload.sender.login + ' has requested a review for pull request ' + payload.number + ' from ' + payload.repository.full_name + '.');
        break;
      case 'review_request_removed':
        pullMessage.push(payload.sender.login + ' has removed a requested review for pull request ' + payload.number + ' from ' + payload.repository.full_name + '.');
        break;
      case 'labeled':
        pullMessage.push(payload.sender.login + ' has added a labele for pull request ' + payload.number + ' from ' + payload.repository.full_name + '.');
        break;
      case 'unlabeled':
        pullMessage.push(payload.sender.login + ' has removed a label for pull request ' + payload.number + ' from ' + payload.repository.full_name + '.');
        break;
      case 'opened':
        pullMessage.push(payload.sender.login + ' has opened a pull request.');
        break;
      case 'edited':
        pullMessage.push(payload.sender.login + ' has edited pull request ' + payload.number + ' from ' + payload.repository.full_name + '.');
        break;
      case 'closed':
        pullMessage.push(payload.sender.login + ' has closed pull request ' + payload.number + ' from ' + payload.repository.full_name + '.');
        break;
      case 'reopened':
        pullMessage.push(payload.sender.login + ' has reopened pull request ' + payload.number + ' from ' + payload.repository.full_name + '.');
        break;
      default:
    }
    pullMessage.push(); //empty line
    pullMessage.push('pull request detail :');
    pullMessage.push('author: ' + payload.pull_request.user.login);
    pullMessage.push('title: ' + payload.pull_request.title);
    pullMessage.push('body: ' + payload.pull_request.body);
    pullMessage.push('commits : (TODO: insert a list of the commits involved)');
    return pullMessage;
  }
  
  return {listen};
})();

module.exports = gitListener;
