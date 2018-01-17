const Logger = require('./Logger');

module.exports = function () {
    const log  = new Logger('LINE');
    const secret = require('../secret/Line');
    
    const ACCESS_TOKEN = secret.access_token;
    const OWNER = secret.owner;

    log.v('Create Line Object');
    
    const self = this;
    
    self.info = userId => {
      const url = 'https://api.line.me/v2/bot/profile/' + userId;
      const response = UrlFetchApp.fetch(url, {
        headers: { Authorization: 'Bearer ' + ACCESS_TOKEN }
      });
      log.v('Info: ' + JSON.stringify(response));
      const responseContent = response.getContentText();
      log.v('Info: ' + JSON.stringify(responseContent));
      return JSON.parse(responseContent);
    };
  
    self.parse = contents => {
      log.v('Parse-Start;');
      return contents.events.map(function (lineEvent) {
        log.v('Parse: ' + JSON.stringify(lineEvent));
  
        const token = lineEvent.replyToken;
        if (typeof token === 'undefined') return undefined;
  
        const message = lineEvent.message.text;
        const id = lineEvent.source.userId;
        const name = self.info(id).displayName;
        
        return { message: message, id: id, name: name, token: token };
  
      }).filter(function (x) { return x; });
    };
    
    self.send = (message, reply) => {
      log.v('Send: ' + message + ' -> ' + (reply ? reply : 'Owner'));
      const url = 'https://api.line.me/v2/bot/message/' + (reply ? 'reply' : 'push');
      
      const payload = {
        messages: (
          message instanceof Array ? message.filter(function (v, i, a) { return i < 5;}) : [message]
        ).map(function (text) { return { type: 'text', text: text}})
      };
      if (reply) payload.replyToken = reply; 
      else payload.to = OWNER;
    
      return UrlFetchApp.fetch(url, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          Authorization: 'Bearer ' + ACCESS_TOKEN,
        },
        method: 'post',
        payload: JSON.stringify(payload),
      });
    };
  
    self.get = url => {
      return UrlFetchApp.fetch(url, {
        headers: { Authorization: 'Bearer ' + ACCESS_TOKEN },
        method: 'get',
      });
    };
  };