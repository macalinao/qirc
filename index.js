#!/usr/bin/env node

var irc = require('irc');
var faker = require('faker');
var rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

var room = process.argv[2];
if (!room) {
  console.log('No room specified. Usage: `qirc <room>`');
  process.exit(1);
}
var nick = faker.name.findName().split(' ').join('');
var channel = '#' + room;

var client = new irc.Client('irc.esper.net', nick, {
  channels: [channel]
});

client.addListener('message' + channel, function(from, message) {
  console.log('<' + from + '> ' + message);
});

client.addListener('error', function(message) {
  console.log('error: ', message);
});

var prefix = '> ';

console.log('Connecting to server...');
client.connect(function() {
  console.log('Connected!');
  rl.setPrompt(prefix, prefix.length);
  rl.prompt();
  rl.on('line', function(line) {
    client.say(channel, line);
    rl.setPrompt(prefix, prefix.length);
    rl.prompt();
  }).on('close', function() {
    process.exit(0);
  });
});
