const gas = require('gas-local');
const request = require('sync-request');
const fs = require('fs');

gas.globalMockDefault.Logger.enabled = false;

const defMock = gas.globalMockDefault;

const customMock = {
    UrlFetchApp: {
        fetch: function (url, param) {
            const req = request('GET', url);
            return Object.assign(req, {
                getContentText: function () {
                     return req.body.toString();
                },
            });
        },
    },
    DocumentApp: {
        openById: function (fileId) {
            return {
                getBody: function () {
                    return {
                        appendParagraph: function (text) {
                            console.log(text);
                        },
                    };
                },
            };
        },
    },
    __proto__: defMock,
};

module.exports = gas.require('./src', customMock);