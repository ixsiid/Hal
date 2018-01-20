const Logger = require('./Logger');
const Storage = require('./Storage');

module.exports = function () {
  const log = new Logger('LINE');
  const infoCache = new Storage('LINE_INFO', ['id', 'name']);
  const secret = require('../secret/Line');

  const ACCESS_TOKEN = secret.access_token;
  const OWNER = secret.owner;

  this.info = userId => {
    const cache = infoCache.values().filter(x => x.id === userId);
    if (cache.length > 0) {
      return { userId, displayName: cache[0].name };
    }

    const url = 'https://api.line.me/v2/bot/profile/' + userId;
    const response = UrlFetchApp.fetch(url, {
      headers: { Authorization: 'Bearer ' + ACCESS_TOKEN }
    });

    const responseContent = JSON.parse(response.getContentText());
    log.i(['Info', userId, responseContent.displayName, '', '']);
    infoCache.add({ id: userId, name: responseContent.displayName });

    return responseContent;
  };

  this.parse = contents => {
    if (!(contents.events instanceof Array)) return undefined;
    return contents.events.map(lineEvent => {

      const token = lineEvent.replyToken;

      const message = lineEvent.message.text;
      const id = lineEvent.source.userId;
      const name = this.info(id).displayName;

      log.i(['Receive', id, name, message, token]);

      return { message: message, id: id, name: name, token: token };

    }).filter(x => x);
  };

  this.send = (message, reply) => {
    const url = 'https://api.line.me/v2/bot/message/' + (reply ? 'reply' : 'push');

    const payload = {
      messages: (message instanceof Array ? message.filter((v, i, a) => i < 5) : [message])
        .map(text => ({ type: 'text', text: text }))
    };

    const text = payload.messages.map(m => m.text).join('\n');
    if (reply) {
      payload.replyToken = reply;
      log.i(['Reply', '', '', text, reply]);
    }
    else {
      payload.to = OWNER;
      log.i(['Send', payload.to, 'Owner', text, '']);
    }

    return UrlFetchApp.fetch(url, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: 'Bearer ' + ACCESS_TOKEN,
      },
      method: 'post',
      payload: JSON.stringify(payload),
    }).getContentText();
  };

  this.get = url => {
    return UrlFetchApp.fetch(url, {
      headers: { Authorization: 'Bearer ' + ACCESS_TOKEN },
      method: 'get',
    });
  };
};