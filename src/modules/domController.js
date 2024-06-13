/* eslint-disable no-plusplus */
import weatherCodes from '../assets/json/weatherCodes.json';
import '../styles/hourly-forecast-style.css';
import clear from '../assets/imgs/clear.png';

const degree = '\u{000B0}';

const getWeatherType = (weatherCode, isDay) => {
    const dayType = isDay === 1 ? 'day' : 'night';

    return weatherCodes[weatherCode][dayType];
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
        tempElement.textContent = `${currentTemp}${degree}`;

        const tempMax = Math.round(locationData.daily.temperature2mMax[0]);
        tempMaxElement.textContent += `${tempMax}${degree}`;

        const tempMin = Math.round(locationData.daily.temperature2mMin[0]);
        tempMinElement.textContent += `${tempMin}${degree}`;
    }

    const weatherType = getWeatherType(
        locationData.current.weatherCode,
        locationData.current.isDay,
    );
    typeElement.textContent = weatherType.description;
};

const updateHourlyForecast = (locationData, tempType) => {
    const card = document.querySelector('.card-content');

    // create first element in card content to be Now
    // create 23 items for next 23 hours
    // total 24 items
    for (let i = 0; i < 24; i++) {
        const item = document.createElement('div');
        item.classList.add('js-hour-item');

        const hourTime = document.createElement('p');
        hourTime.classList.add('js-hour-time');
        const hour = i === 0 ? 'Now' : new Date(locationData.hourly.time[i]).getHours();
        hourTime.textContent = hour;
        const hourWeatherType = document.createElement('img');
        hourWeatherType.classList.add('js-hour-weather-type');
        hourWeatherType.setAttribute('alt', 'Weather type icon');
        hourWeatherType.setAttribute('height', '24');
        console.log()
        const weatherType = getWeatherType(
            locationData.hourly.weatherCode[i],
            locationData.hourly.isDay[i],
        );
        hourWeatherType.src = weatherType.image;
        const hourTemp = document.createElement('p');
        hourTemp.classList.add('js-hour-temp');
        const temp = tempType === 'C' ? Math.round(locationData.hourly.temperature2m[i]) : Math.round((locationData.hourly.temperature2m[i] * (9 / 5)) + 32);
        hourTemp.textContent = `${temp}${degree}`;

        item.append(hourTime, hourWeatherType, hourTemp);
        card.append(item);
    }
};

export default async function updateWeatherInfo(locationData, tempType) {
    await updateBriefInfo(locationData, tempType);
    await updateHourlyForecast(locationData, tempType);
}
