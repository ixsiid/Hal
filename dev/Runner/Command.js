const Date = require('date-with-offset');
const zone = require('../../secret/Locale').timezoneOffset;

const BaseRunner = require('./BaseRunner');
const Line = require('../Line');
const Logger = require('../Logger');


module.exports = function (contents) {
    const base = new BaseRunner(contents);
    const line = new Line();
    const log = new Logger('LINE WEATHER');

    base.match = () => {
        const messages = line.parse(contents);
        this.command = messages.map(m => {
            const cmd = Command.filter(x => x.test.test(m.message))[0];
            return !cmd ? undefined : {
                text: cmd.proc(m.message),
                token: m.token,
            };
        }).filter(x => x);

        return this.command.length > 0;
    };

    base.run = () => {
        this.command.map(x => line.send(x.text, x.token));
        return { content: 'post ok' };
    };

    base.toString = () => 'Command runner';

    return base;
};


const Command = [{
    test: /^[hH]al[\s、,.，。][hH][eE][lL][pP]/,
    proc: function (text) {
        return Command
            .filter(function (cmd) { return !cmd.private; })
            .map(function (cmd) { return cmd.summary; }).join('\n')
            + '\nあとMTBスポットの天気とか返事します。';
    },
    private: false,
    summary: 'help: このメッセージを表示します。',
}, {
    test: /^[hH]al[\s、,.，。]info/,
    proc: function (text) {
        return 'こんにちわ！私はLine BotのHalです！\n2018年1月1日生まれ、まだまだ何もできません＞＜\nフレンドにしか反応できないからぜひ登録してね。';
    },
    private: false,
    summary: 'info: 自己紹介します。',
}, {
    test: /^[hH]al[ちチ][ゃャ]/,
    proc: function (text) { return 'ん？'; },
    private: true,
    summary: 'Ping - Pong',
}, {
    test: /[hH]al.*?[aA][iI]/,
    proc: function (text) { return 'HalはAIじゃありません。BOTです。'; },
    private: true,
    summary: 'Hal is not AI.',
}, {
    test: /[hH]al$/,
    proc: function (text) { return 'そう。'; },
    private: true,
}, {
    test: /^[hH]al\s/,
    proc: function (text) { return '...'; },
    private: true,
}, {
    test: /茂出木/,
    proc: function (text) { return 'もしかして: 茂木'; },
    private: true,
}, {
    test: /達治/,
    proc: function (text) { return 'もしかして: 達志'; },
    private: true,
}];