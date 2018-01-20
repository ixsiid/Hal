const Range = function (sheetName, row, column, rowSize, columnSize) {
    this.setValue = value => { };
    this.setBackground = color => { };
    this.setValues = values => {
        values.map(row => console.log(`${sheetName} - ${row.join(', ')}`));
    };
    this.getValues = () => {
        const r = [];
        for (let i = 0; i < rowSize; i++) {
            const n = [];
            for (let j = 0; j < columnSize; j++) n.push(`${i}_${j}`);
            r.push(n);
        }
        return r;
    };
};

const Sheet = function (name) {
    this.getLastRow = () => 0;
    this.getRange = (row, column, rowSize, columnSize) => new Range(name, row, column, rowSize, columnSize);
    this.clear = () => console.log(`sheet [${name}] is cleared.`);
    this.deleteRow = index => console.log(`delete row in sheet [${name}][${index}]`);
};

module.exports = {
    openById: function (fileId) {
        return {
            getSheets: function () { return []; },
            insertSheet: name => new Sheet(name),
            getSheetByName: name => new Sheet(name),
        };
    },
};