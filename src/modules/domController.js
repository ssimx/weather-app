/* eslint-disable no-lonely-if */
/* eslint-disable no-plusplus */
import weatherCodes from '../assets/json/weatherCodes.json';
import '../styles/hourly-forecast-style.css';
import '../styles/daily-forecast-style.css';
import '../styles/feels-like-style.css';
import '../styles/uv-index-style.css';
import createTempBarElement from './tempBar';

const degreeIcon = '\u{000B0}';

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

    const currentTemp = Math.round(locationData.current.temperature2m);
    const tempMax = Math.round(locationData.daily.temperature2mMax[0]);
    const tempMin = Math.round(locationData.daily.temperature2mMin[0]);

    tempElement.textContent = tempType === 'C' ? `${currentTemp}${degreeIcon}` : Math.round(`${currentTemp}${degreeIcon}` * (9 / 5)) + 32;
    tempMaxElement.textContent = tempType === 'C' ? `${tempMax}${degreeIcon}` : Math.round(`${tempMax}${degreeIcon}` * (9 / 5)) + 32;
    tempMinElement.textContent = tempType === 'C' ? `${tempMin}${degreeIcon}` : Math.round(`${tempMin}${degreeIcon}` * (9 / 5)) + 32;

    const weatherType = getWeatherType(
        locationData.current.weatherCode,
        locationData.current.isDay,
    );
    typeElement.textContent = weatherType.description;
};

const updateHourlyForecast = (locationData, tempType) => {
    const hourly = document.querySelector('.hourly-forecast');
    const card = hourly.querySelector('.card-content');

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
        const weatherType = getWeatherType(
            locationData.hourly.weatherCode[i],
            locationData.hourly.isDay[i],
        );
        hourWeatherType.src = weatherType.image;
        const hourTemp = document.createElement('p');
        hourTemp.classList.add('js-hour-temp');
        const temp = tempType === 'C' ? Math.round(locationData.hourly.temperature2m[i]) : Math.round((locationData.hourly.temperature2m[i] * (9 / 5)) + 32);
        hourTemp.textContent = `${temp}${degreeIcon}`;

        item.append(hourTime, hourWeatherType, hourTemp);
        card.append(item);
    }
};

const updateDailyForecast = (locationData, tempType) => {
    const daily = document.querySelector('.daily-forecast');
    const card = daily.querySelector('.card-content');

    // create first element for today
    // create 9 elements for following days
    // total 10 elements
    const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 8; i < 18; i++) {
        const hr = document.createElement('hr');
        const item = document.createElement('div');
        item.classList.add('js-daily-item');

        const dayNameElement = document.createElement('p');
        dayNameElement.classList.add('js-day-name');
        const day = new Date(locationData.daily.time[i]).getDay();
        dayNameElement.textContent = i === 8 ? 'Today' : weekday[day];
        const dailyWeatherTypeElement = document.createElement('img');
        dailyWeatherTypeElement.classList.add('js-hour-weather-type');
        dailyWeatherTypeElement.setAttribute('alt', 'Weather type icon');
        dailyWeatherTypeElement.setAttribute('height', '24');
        const weatherType = getWeatherType(
            locationData.daily.weatherCode[i],
            1,
        );
        dailyWeatherTypeElement.src = weatherType.image;
        const minTempElement = document.createElement('p');
        const maxTempElement = document.createElement('p');
        minTempElement.classList.add('js-daily-temp-min');
        maxTempElement.classList.add('js-daily-temp-max');

        const minTemp = tempType === 'C' ? Math.round(locationData.daily.temperature2mMin[i]) : Math.round((locationData.daily.temperature2mMin[i] * (9 / 5)) + 32);
        minTempElement.textContent = `${minTemp}${degreeIcon}`;

        const maxTemp = tempType === 'C' ? Math.round(locationData.daily.temperature2mMax[i]) : Math.round((locationData.daily.temperature2mMax[i] * (9 / 5)) + 32);
        maxTempElement.textContent = `${maxTemp}${degreeIcon}`;

        const barElement = createTempBarElement(minTemp, maxTemp);

        item.append(
            dayNameElement,
            dailyWeatherTypeElement,
            minTempElement,
            barElement,
            maxTempElement,
        );

        if (i < 17) {
            card.append(item, hr);
        } else {
            card.append(item);
        }
    }
};

const updateFeelsLike = (locationData, tempType) => {
    const feels = document.querySelector('.feels-like');
    const card = feels.querySelector('.card-content');
    const feelsLikeTemp = Math.round(locationData.current.apparentTemperature);
    const currentTemp = Math.round(locationData.current.temperature2m);

    const temp = document.createElement('div');
    temp.classList.add('js-feels-temp');
    temp.textContent = tempType === 'C' ? `${feelsLikeTemp}${degreeIcon}` : Math.round(`${feelsLikeTemp}${degreeIcon}` * (9 / 5)) + 32;

    const desc = document.createElement('div');
    desc.classList.add('js-feels-desc');

    const tempDif = feelsLikeTemp - currentTemp;
    if (tempType === 'C') {
        if (Math.abs(tempDif) <= 3) desc.textContent = 'Similar to the actual temperature.';
        else if (tempDif > 3) desc.textContent = 'Hotter than the actual temperature.';
        else if (tempDif > -3) desc.textContent = 'Colder than the actual temperature.';
    } else {
        if (Math.abs(tempDif) <= 6) desc.textContent = 'Similar to the actual temperature.';
        else if (tempDif > 6) desc.textContent = 'Hotter than the actual temperature.';
        else if (tempDif > -6) desc.textContent = 'Colder than the actual temperature.';
    }

    card.append(temp, desc);
};

const updateUvIndex = (locationData) => {
    const uvIndex = document.querySelector('.uv-index');
    const card = uvIndex.querySelector('.card-content');
    const index = Math.round(locationData.daily.uvIndexMax[0]);

    const indexDiv = document.createElement('div');
    indexDiv.classList.add('js-uv-index');
    const indexNumber = document.createElement('p');
    indexNumber.classList.add('js-index');
    indexNumber.textContent = index;
    const indexScale = document.createElement('p');
    indexScale.classList.add('js-scale');

    const indexDesc = document.createElement('div');
    indexDesc.classList.add('js-uv-desc');
    if (index >= 0 && index <= 2) {
        indexScale.textContent = 'Normal';
        indexDesc.textContent = 'You can safely enjoy being outside.';
    } else if (index >= 3 && index <= 5) {
        indexScale.textContent = 'Moderate';
        indexDesc.textContent = 'Use sun protection.';
    } else if (index >= 6 && index <= 7) {
        indexScale.textContent = 'High';
        indexDesc.textContent = 'Use sun protection and seek shade.';
    } else if (index >= 8 && index <= 10) {
        indexScale.textContent = 'Very high';
        indexDesc.textContent = 'Avoid being outside.';
    } else if (index >= 11) {
        indexScale.textContent = 'Extreme';
        indexDesc.textContent = 'Avoid being outside.';
    }

    const indexBarDiv = document.createElement('div');
    indexBarDiv.classList.add('js-uv-bar');
    const indexBar = document.createElement('div');
    indexBar.classList.add('js-bar');
    indexBar.style.left = index > 10 ? '100%' : `${index}0%`;

    indexDiv.append(indexNumber, indexScale);
    indexBarDiv.append(indexBar);
    card.append(indexDiv, indexBarDiv, indexDesc);
};

export default function updateWeatherInfo(locationData, tempType) {
    updateBriefInfo(locationData, tempType);
    updateHourlyForecast(locationData, tempType);
    updateDailyForecast(locationData, tempType);
    updateFeelsLike(locationData, tempType);
    updateUvIndex(locationData);
}
