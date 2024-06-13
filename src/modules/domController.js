import weatherCodes from '../assets/json/weatherCodes.json';

const getWeatherType = (weatherCode, isDay) => {
    const dayType = isDay === 1 ? 'day' : 'night';

    return weatherCodes[weatherCode][dayType].description;
};

const updateBriefInfo = (locationData, tempType) => {
    const locationBriefInfo = document.querySelector('.location-brief-info');
    const cityElement = locationBriefInfo.querySelector('.city');
    const tempElement = locationBriefInfo.querySelector('.temp');
    const typeElement = locationBriefInfo.querySelector('.type');
    const tempMaxElement = locationBriefInfo.querySelector('.temp-high');
    const tempMinElement = locationBriefInfo.querySelector('.temp-low');

    const name = locationData.location.name.split(',')[0];
    cityElement.textContent = name;

    if (tempType === 'C') {
        const currentTemp = Math.round(locationData.current.temperature2m);
        tempElement.textContent = currentTemp;

        const tempMax = Math.round(locationData.daily.temperature2mMax[0]);
        tempMaxElement.textContent += tempMax;

        const tempMin = Math.round(locationData.daily.temperature2mMin[0]);
        tempMinElement.textContent += tempMin;
    }

    const weatherType = getWeatherType(locationData.current.weatherCode,
        locationData.current.isDay);
    typeElement.textContent = weatherType;
};

export default function updateWeatherInfo(locationData, tempType) {
    updateBriefInfo(locationData, tempType);
}
