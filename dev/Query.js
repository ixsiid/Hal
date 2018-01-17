module.exports = function (baseUrl, fixQuery) {
    const url = baseUrl;
    const key = fixQuery;

    this.get = (path, query) => `${url}${path}?${key}&${query}`;
};
