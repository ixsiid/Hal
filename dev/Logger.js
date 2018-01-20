const Date = require('date-with-offset');
const zone = require('../secret/Locale').timezoneOffset;

module.exports = function (tag) {
    const self = this;
    const fileId = require('../secret/Google.js').log;

    const file = SpreadsheetApp.openById(fileId);
    const sheetNames = file.getSheets().map(x => x.getName());
    if (sheetNames.indexOf(tag) < 0) {
        file.insertSheet(tag).getRange(1, 1, 1, 3).setValues([
            ['DateTime', 'Level', 'Content']
        ]);
    }
    const sheet = file.getSheetByName(tag);

    const levels = 'newidv';
    this.level = 7;
    const colors = ['white', 'red', 'yellow', 'aqua', 'white', 'gray'];

    const put = (level, object) => {
        if (self.level < levels.indexOf(level)) return;

        const text = (() => {
            if (object instanceof Array) return object.map(x => {
                return typeof x === 'string' ? x : JSON.stringify(x);
            });
            return [typeof object === 'string' ? object : JSON.stringify(object)];
        })();
        const datetime = JSON.stringify(new Date(zone)).substring(1, 20);

        const row = sheet.getLastRow() + 1;
        sheet.getRange(row, 1, 1, 2 + text.length).setValues([
            [datetime, level.toUpperCase()].concat(text)
        ]);
        sheet.getRange(row, 2).setBackground(colors[levels.indexOf(level)]);

        return `${tag} :: [${datetime}](${level}) - ${JSON.stringify(text)}`;
    };

    [].map.call(levels, level => {
        self[level] = object => put(level, object);
    });
};