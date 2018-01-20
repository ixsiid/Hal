const Date = require('date-with-offset');
const zone = require('../../secret/Locale').timezoneOffset;

const Logger = require('../Logger');
const Localize = require('./Localize');

module.exports = function (data) {
    const log = new Logger('FORECAST');
    const localize = new Localize('japanese');
    log.v(data);

    const days = '日月火水木金土';
    this.raw = data;
    this.date = new Date(data.dt * 1000, zone);
    this.dateLong = this.date.getFullYear() + '年' +
        (this.date.getMonth() + 1) + '月'
        + this.date.getDate() + '日 '
        + days[this.date.getDay()] + '曜日';
    this.dateShort = (this.date.getMonth() + 1) + '/' + this.date.getDate();

    this.temp = {};
    Object.keys(data.temp).map(k => {
        this.temp[k] = (data.temp[k] - 273.15).toFixed(0);
    });
    this.short = localize.get(data.weather[0].main) + ' ' + this.temp.min + ' ~ ' + this.temp.max + '℃';
    this.long = this.dateLong + 'の天気は' +
        localize.get(data.weather[0].description) + '、気温 '
        + this.temp.min + '℃から' + this.temp.max + '℃です。';

    log.i('天気取得: ' + this.short);
};
