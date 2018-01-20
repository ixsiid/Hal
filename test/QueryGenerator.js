module.exports = function (method, query) {
    return ({
        GET: function (queryString) {
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
        },
        POST: function (query) {
            const postData = {
                type: 'application/json',
                length: JSON.stringify(query).length + 20,
                contents: query,
                name: 'postData',
            };
            
            return {
                parameter: {},
                contextPath: '',
                contextLength: postData.length,
                queryString: '',
                postData,
            };
        },
    })[method.toUpperCase()](query);
};
