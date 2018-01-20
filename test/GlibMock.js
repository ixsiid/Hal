const gas = require('gas-local');
const request = require('sync-request');
const fs = require('fs');

gas.globalMockDefault.Logger.enabled = false;

const defMock = gas.globalMockDefault;

const customMock = {
    UrlFetchApp: {
        fetch: function (url, param) {
            const method = param.method.toUpperCase();
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
    SpreadsheetApp: {
        openById: function (fileId) {
            return {
                getSheets: function () { return []; },
                insertSheet: function (name) { },
                getSheetByName: function (name) {
                    return {
                        getLastRow: function () { return 0; },
                        getRange: function (row, col) {
                            return {
                                setValue: function (value) { },
                                setBackground: function (color) { },
                                setValues: function (array) {
                                    array.map(row => {
                                        console.log(row.join(', '));
                                    });
                                },
                            };
                        },
                    };
                },
            };
        },
    },
    __proto__: defMock,
};

module.exports = gas.require('./src', customMock);