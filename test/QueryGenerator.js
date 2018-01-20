const Date = require('date-with-offset');
const zone = require('../secret/Locale').timezoneOffset;

const GET = function (queryString) {
    if (queryString[0] === '?') queryString = queryString.substring(1);
    const parameter = {};
    const parameters = {};
    queryString.split('&').map(x => {
        const q = x.split('=');
        const key = q.shift();
        const value = q.join('&');
        parameter[key] = value;
        if (!(key in parameters)) parameters[key] = [];
        parameters[key].push(value);
    });

    return {
        parameter,
        contextPath: '',
        contextLength: -1,
        queryString,
        parameters,
    };
};

const POST = function (query) {
    const contents = new Buffer(JSON.stringify(query), 'utf-8');
    const postData = {
        type: 'application/json',
        length: contents.length,
        contents: JSON.stringify(query),
        name: 'postData',
    };

    return {
        parameter: {},
        contextPath: '',
        contextLength: postData.length,
        queryString: '',
        postData,
    };
};

const OWNER = require('../secret/Line').owner;
const LINE = function (message) {
    return POST({
        events: [{
            type: 'message',
            source: {
                userId: OWNER,
                type: 'user',
            },
            timestamp: new Date(zone).getTime(),
            message: {
                type: 'text',
                text: message,
            },
        }],
    });
};

module.exports = function (method, query) {
    return ({ GET, POST, LINE })[method.toUpperCase()](query);
};
