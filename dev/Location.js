module.exports = function (geo) {
    const [latitude, longitude] = [geo.latitude, geo.longitude];
    if (!latitude) throw new Error(`${latitude} is not float`);
    if (!longitude) throw new Error(`${longitude} is not float`);

    this.openWeatherMap = () => ({lat: latitude, lon: longitude});
    this.toString = () => `Location Object`;
};
