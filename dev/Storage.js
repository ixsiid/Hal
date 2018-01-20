module.exports = function (table, header) {
    const fileId = require('../secret/Google').storage;

    const file = SpreadsheetApp.openById(fileId);
    const sheetNames = file.getSheets().map(x => x.getName());
    if (sheetNames.indexOf(table) < 0) {
        file.insertSheet(table).getRange(1, 1, 1, header.length).setValues([header]);
    } else {
        const sheet = file.getSheetByName(table);
        const fileHeader = sheet.getRange(1, 1, 1, header.length).getValues()[0];
        if (JSON.stringify(header.sort()) !== JSON.stringify(fileHeader.sort())) {
            sheet.clear();
            sheet.getRange(1, 1, 1, header.length).setValues([header]);
        }
    }

    const sheet = file.getSheetByName(table);
    const headers = sheet.getRange(1, 1, 1, header.length).getValues()[0];

    this.values = () => {
        const n = sheet.getLastRow();
        const result = [];
        for (let i = 2; i <= n; i++) {
            const row = {};
            for (let j = 0; j < headers.length; j++) {
                row[headers[j]] = sheet.getRange(i, j + 1).getValue();
            }
            result.push(row);
        }
        return result;
    };

    this.add = data => {
        const row = sheet.getLastRow() + 1;
        for (let j = 0; j < headers.length; j++) {
            sheet.getRange(row, j + 1).setValue(data[headers[j]]);
        }
    };

    this.remove = index => {
        sheet.deleteRow(index + 2);
    };
};
