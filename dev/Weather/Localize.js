module.exports = function (locale) {
    if (!(locale in strings)) throw new Error('No locale');
    this.string = strings[locale];

    this.get = key => {
        if (typeof key === 'string') key in this.string ? this.string[key] : key;
        if (key instanceof Array) return key.map(k => this.get(k)).join('');
        return key.toString();
    };
};

const strings = {};
strings.japanese = {
    Clouds: '曇り',
    Snow: '雪',
    Clear: '快晴',
    Rain: '雨',
};
