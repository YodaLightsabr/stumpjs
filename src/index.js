/*
  Stump.js
  Innovative logging for Node.js
*/
const fetch = require('node-fetch');
const Discord = { // Provide LogBridge support
  queue: [],
  requestPost: (text) => {
    Discord.queue.push(text); 
  },
  init: (interval = 3000) => {
    setInterval(() => {
      if (Discord.queue.length) fetch(Discord.webhook, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: Discord.queue.map(message => {
            if (message.startsWith('  ERROR  ')) {
              return '```asciidoc\n' + message + '```';
            } else {
              return '```' + message + '```';
            }
          }).join(''),
          username: 'Stump.js',
          avatar_url: 'https://static.yodacode.repl.co/stumpjswebhook.png'
        })
      }).then(response => {
        Discord.queue = [];
      })
    }, interval);
  }
}
const DefaultMethods = {
  console: async (type, settings, ...messages) => {
    if (type === 'info') console.log('\x1b[47m\x1b[30m   INFO    \x1b[0m', ...messages);
    if (type === 'success') console.log('\x1b[42m\x1b[30m  SUCCESS  \x1b[0m', ...messages);
    if (type === 'verbose') console.log('\x1b[44m\x1b[30m  VERBOSE  \x1b[0m', ...messages);
    if (type === 'error') console.error('\x1b[41m\x1b[30m   ERROR   \x1b[0m', ...messages);
    if (type === 'warn') console.warn('\x1b[43m\x1b[30m   WARN    \x1b[0m', ...messages);
    if (type === 'debug') console.log('\x1b[45m\x1b[30m   DEBUG   \x1b[0m', ...messages);
    return 0;
  },
  discord: (type, settings, ...messages) => {
    let prepend;
    if (type === 'info') prepend = '  INFO   ';
    if (type === 'success') prepend = ' SUCCESS ';
    if (type === 'verbose') prepend = ' VERBOSE ';
    if (type === 'error') prepend = '  ERROR  ';
    if (type === 'warn') prepend = '  WARN   ';
    if (type === 'debug') prepend = '  DEBUG  ';
    prepend = `${prepend}::`;
    messages = messages.map(message => {
      if (typeof message === 'string') return message;
      if (typeof message === 'function') return message.toString();
      if (message instanceof Promise) return 'Promise { unkown }';
      if (typeof message === 'number') return message;
      return JSON.stringify(message);
    });
    Discord.webhook = settings.webhook;
    Discord.requestPost(prepend + ' ' + messages.join(' '));
  }
} // Built-in Stump.js features
class Stump {
  constructor (features, settings) {
    this.actions = [];
    this.actions.push(DefaultMethods.console);
    this.settings = settings || {};
    for (var i = 0; i < features.length; i++) {
      let feature = features[i];
      if (typeof feature === 'string' && feature.toLowerCase() === 'debug') {
        this.settings.debug = true;
      }
      if (typeof feature === 'string' && feature.toLowerCase() === 'discord') {
        this.actions.push(DefaultMethods.discord);
        Discord.init();
      }
    }
  }
  info (...messages) {
    const promises = [];
    for (var i = 0; i < this.actions.length; i++) {
      promises.push(this.actions[i]('info', this.settings, ...messages));
    }
    return Promise.all(promises);
  }
  success (...messages) {
    const promises = [];
    for (var i = 0; i < this.actions.length; i++) {
      promises.push(this.actions[i]('success', this.settings, ...messages));
    }
    return Promise.all(promises);
  }
  debug (...messages) {
    const promises = [];
    for (var i = 0; i < this.actions.length; i++) {
      if (this.settings.debug) promises.push(this.actions[i]('debug', this.settings, ...messages));
    }
    return Promise.all(promises);
  }
  error (...messages) {
    const promises = [];
    for (var i = 0; i < this.actions.length; i++) {
      promises.push(this.actions[i]('error', this.settings, ...messages));
    }
    return Promise.all(promises);
  }
  warn (...messages) {
    const promises = [];
    for (var i = 0; i < this.actions.length; i++) {
      promises.push(this.actions[i]('warn', this.settings, ...messages));
    }
    return Promise.all(promises);
  }
  verbose (...messages) {
    const promises = [];
    for (var i = 0; i < this.actions.length; i++) {
      if (this.settings.debug) promises.push(this.actions[i]('verbose', this.settings, ...messages));
    }
    return Promise.all(promises);
  }
}
module.exports = Stump;