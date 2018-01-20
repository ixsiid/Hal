const gas = require('gas-local');
const request = require('sync-request');
const fs = require('fs');

gas.globalMockDefault.Logger.enabled = false;

const defMock = gas.globalMockDefault;

const SpreadsheetApp = require('./MockSpreadSheetApp');

const customMock = {
    UrlFetchApp: {
        fetch: function (url, param) {
            const method = param.method ? param.method.toUpperCase() : 'GET';
            const option = {};
            if ('headers' in param) option.headers = param.headers;
            if ('payload' in param) option.body = param.payload;
            const req = request(method, url, option);
            return Object.assign(req, {
                getContentText: function () {
                    return req.body.toString();
                },
            });
        },
    },
    ContentService: {
        createTextOutput: function (text) {
            return {
                setMimeType: function (mimeType) {
                    return {
                        content: text,
                        mime: mimeType,
                    };
                },
            };
        },
        MimeType: {
            JSON: 'application/javascript'
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
    SpreadsheetApp,
    __proto__: defMock,
};

module.exports = gas.require('./src', customMock);