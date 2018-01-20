const Range = function (sheetName) {
    this.setValue = value => {};
    this.setBackground = color => {};
    this.setValues = values => {
        values.map(row => console.log(`${sheetName} - ${row.join(', ')}`));
    };
};

const Sheet = function (name) {
    this.getLastRow = () => 0;
    this.getRange = (row, column, rowSize, columnSize) => new Range(name);
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