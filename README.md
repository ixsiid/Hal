# Hal

requirements secret keys

secret/Google.js
module.exports = {
    token: {
        // your access token by get method.
    },
    log2: it not use,
    log: file id of log file at spreadsheet,
};


secret/Line.js
module.exports = {
    "access_token": your access token,
    "owner": your user id,
};


secret/Locale.js
module.exports = {
    timezoneOffset: N * 60,
};


secret/OpenWeatherMap.js
const Location = require('../dev/Location');

module.exports = {
    key: your api key,
    locations: [{
        name: 'Name',
        group: ['Group A'],
        geo: { latitude: lat, longitude: lon },
    }].map(x => ({name: x.name, group: x.group, location: new Location(x.geo)})),
};
