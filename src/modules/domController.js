/* eslint-disable no-lonely-if */
/* eslint-disable no-plusplus */
import '../styles/hourly-forecast-style.css';
import '../styles/daily-forecast-style.css';
import '../styles/feels-like-style.css';
import '../styles/uv-index-style.css';
import '../styles/sunrise-sunset-style.css';
import '../styles/wind-style.css';
import '../styles/pressure-style.css';
import sunnyBg from '../assets/gifs/sunny.gif';
import cloudyBg from '../assets/gifs/cloudy.gif';
import veryCloudyBg from '../assets/gifs/very-cloudy.gif';
import fogBg from '../assets/gifs/fog.gif';
import lightRainBg from '../assets/gifs/light-rain.gif';
import rainBg from '../assets/gifs/rain.gif';
import heavyRainBg from '../assets/gifs/heavy-rain.gif';
import lightSnowBg from '../assets/gifs/light-snow.gif';
import snowBg from '../assets/gifs/snow.gif';
import nightClearBg from '../assets/gifs/night-clear.gif';
import nightCloudyBg from '../assets/gifs/night-cloudy.gif';
import nightVeryCloudyBg from '../assets/gifs/night-very-cloudy.gif';
import nightFogBg from '../assets/gifs/night-fog.gif';
import nightLightRainBg from '../assets/gifs/night-light-rain.gif';
import nightRainBg from '../assets/gifs/night-rain.gif';
import nightHeavyRainBg from '../assets/gifs/night-heavy-rain.gif';
import nightThunderstormBg from '../assets/gifs/night-thunderstorm.gif';
import nightLightSnowBg from '../assets/gifs/night-light-snow.gif';
import nightSnowBg from '../assets/gifs/night-snow.gif';
import nightHeavySnowBg from '../assets/gifs/night-heavy-snow.gif';
import heavySnowBg from '../assets/gifs/heavy-snow.gif';
import thunderstormBg from '../assets/gifs/thunderstorm.gif';
import sunset from '../assets/icons/sunset.svg';
import sunrise from '../assets/icons/sunrise.svg';
import weatherCodes from '../assets/json/weatherCodes.json';
import createTempBarElement from './tempBar';
import formatDateTimezone from './timezoneFormatter';
import pressureGauge from './pressureGauge';
import renderPrecipitationMap from './precipitationMap';

const degreeIcon = '\u{000B0}';

const getWeatherType = (weatherCode, isDay) => {
    const dayType = isDay === 1 ? 'day' : 'night';

    return weatherCodes[weatherCode][dayType];
};

const getWeatherBackground = (locationData) => {
    const weatherType = getWeatherType(
        locationData.current.weatherCode,
        locationData.current.isDay,
    );

    if (locationData.current.isDay === 0) {
        switch (weatherType.background) {
            case 'clear':
                return nightClearBg;
            case 'cloudy':
                return nightCloudyBg;
            case 'very-cloudy':
                return nightVeryCloudyBg;
            case 'fog':
                return nightFogBg;
            case 'light-rain':
                return nightLightRainBg;
            case 'rain':
                return nightRainBg;
            case 'heavy-rain':
                return nightHeavyRainBg;
            case 'light-snow':
                return nightLightSnowBg;
            case 'snow':
                return nightSnowBg;
            case 'heavy-snow':
                return nightHeavySnowBg;
            case 'thunderstorm':
                return nightThunderstormBg;
            default:
                return '';
        }
    } else {
        switch (weatherType.background) {
            case 'sunny':
                return sunnyBg;
            case 'cloudy':
                return cloudyBg;
            case 'very-cloudy':
                return veryCloudyBg;
            case 'fog':
                return fogBg;
            case 'light-rain':
                return lightRainBg;
            case 'rain':
                return rainBg;
            case 'heavy-rain':
                return heavyRainBg;
            case 'light-snow':
                return lightSnowBg;
            case 'snow':
                return snowBg;
            case 'heavy-snow':
                return heavySnowBg;
            case 'thunderstorm':
                return thunderstormBg;
            default:
                return '#248DC7';
        }
    }
};

const updateWeatherBackground = (locationData) => {
    const weatherType = getWeatherType(
        locationData.current.weatherCode,
        locationData.current.isDay,
    );

    const bgFile = getWeatherBackground(locationData);
    const locationDiv = document.querySelector('#location');
    locationDiv.style.backgroundImage = `url(${bgFile})`;

    if (locationData.current.isDay === 0) {
        const direction = document.querySelector('.direction-text');

        direction.style.backgroundColor = 'rgb(0 41 96)';

        switch (weatherType.background) {
            case 'clear':
                locationDiv.style.backgroundPosition = '65%';
                break;
            case 'cloudy':
                locationDiv.style.backgroundPosition = '65%';
                break;
            case 'very-cloudy':
                locationDiv.style.backgroundPosition = '90%';
                break;
            case 'fog':
                locationDiv.style.backgroundPosition = '90%';
                break;
            case 'light-rain':
                locationDiv.style.backgroundPosition = '50%';
                break;
            case 'rain':
                locationDiv.style.backgroundPosition = '50%';
                break;
            case 'heavy-rain':
                locationDiv.style.backgroundPosition = '50%';
                break;
            case 'light-snow':
                locationDiv.style.backgroundPosition = '50%';
                break;
            case 'snow':
                locationDiv.style.backgroundPosition = '50%';
                break;
            case 'heavy-snow':
                locationDiv.style.backgroundPosition = '50%';
                break;
            case 'thunderstorm':
                locationDiv.style.backgroundPosition = '60%';
                break;
            default:
                locationDiv.style.background = '#248DC7';
        }
    } else {
        switch (weatherType.background) {
            case 'sunny':
                locationDiv.style.backgroundPosition = '60%';
                break;
            case 'cloudy':
                locationDiv.style.backgroundPosition = '60%';
                break;
            case 'very-cloudy':
                locationDiv.style.backgroundPosition = '90%';
                break;
            case 'fog':
                locationDiv.style.backgroundPosition = '80%';
                break;
            case 'light-rain':
                locationDiv.style.backgroundPosition = '50%';
                break;
            case 'rain':
                locationDiv.style.backgroundPosition = '60%';
                break;
            case 'heavy-rain':
                locationDiv.style.backgroundPosition = '90%';
                break;
            case 'light-snow':
                locationDiv.style.backgroundPosition = '50%';
                break;
            case 'snow':
                locationDiv.style.backgroundPosition = '50%';
                break;
            case 'heavy-snow':
                locationDiv.style.backgroundPosition = '50%';
                break;
            case 'thunderstorm':
                locationDiv.style.backgroundPosition = '80%';
                break;
            default:
                locationDiv.style.background = '#248DC7';
        }
    }
};

const updateBriefInfo = (locationData, systemType) => {
    const locationBriefInfo = document.querySelector('.location-brief-info');
    const cityElement = locationBriefInfo.querySelector('.city');
    const tempNumberElement = locationBriefInfo.querySelector('.temp-number');
    const tempIconElement = locationBriefInfo.querySelector('.temp-icon');
    const typeElement = locationBriefInfo.querySelector('.type');
    const tempMaxElement = locationBriefInfo.querySelector('.temp-high');
    const tempMinElement = locationBriefInfo.querySelector('.temp-low');

    const name = locationData.location.name.split(',')[0];
    cityElement.textContent = name;

    const currentTemp = Math.round(locationData.current.temperature2m);
    const tempMax = Math.round(locationData.daily.temperature2mMax[0]);
    const tempMin = Math.round(locationData.daily.temperature2mMin[0]);

    tempNumberElement.textContent = systemType === 'metric' ? `${currentTemp}` : Math.round(`${currentTemp * ((9 / 5) + 32)}`);
    tempIconElement.textContent = `${degreeIcon}`;
    tempMaxElement.textContent += systemType === 'metric' ? `${tempMax}${degreeIcon}` : Math.round(`${tempMax * ((9 / 5) + 32)}${degreeIcon}`);
    tempMinElement.textContent += systemType === 'metric' ? `${tempMin}${degreeIcon}` : Math.round(`${tempMin * ((9 / 5) + 32)}${degreeIcon}`);

    const weatherType = getWeatherType(
        locationData.current.weatherCode,
        locationData.current.isDay,
    );
    typeElement.textContent = weatherType.description;
};

const updateHourlyForecast = (locationData, systemType) => {
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
        const temp = systemType === 'metric' ? Math.round(locationData.hourly.temperature2m[i]) : Math.round((locationData.hourly.temperature2m[i] * (9 / 5)) + 32);
        hourTemp.textContent = `${temp}${degreeIcon}`;

        item.append(hourTime, hourWeatherType, hourTemp);
        card.append(item);
    }
};

const updateDailyForecast = (locationData, systemType) => {
    const daily = document.querySelector('.daily-forecast');
    const card = daily.querySelector('.card-content');

    // create first element for today
    // create 9 elements for following days
    // total 10 elements
    const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 7; i < 18; i++) {
        const hr = document.createElement('hr');
        const item = document.createElement('div');
        item.classList.add('js-daily-item');

        const dayNameElement = document.createElement('p');
        dayNameElement.classList.add('js-day-name');
        const day = new Date(locationData.daily.time[i]).getDay();
        dayNameElement.textContent = i === 7 ? 'Today' : weekday[day];
        const dailyWeatherTypeElement = document.createElement('img');
        dailyWeatherTypeElement.classList.add('js-daily-weather-type');
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

        const minTemp = systemType === 'metric' ? Math.round(locationData.daily.temperature2mMin[i]) : Math.round((locationData.daily.temperature2mMin[i] * (9 / 5)) + 32);
        minTempElement.textContent = `${minTemp}${degreeIcon}`;

        const maxTemp = systemType === 'metric' ? Math.round(locationData.daily.temperature2mMax[i]) : Math.round((locationData.daily.temperature2mMax[i] * (9 / 5)) + 32);
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

const updatePrecipitationMap = (locationData) => {
    renderPrecipitationMap(locationData);
};

const updateFeelsLike = (locationData, systemType) => {
    const feels = document.querySelector('.feels-like');
    const card = feels.querySelector('.card-content');
    const feelsLikeTemp = Math.round(locationData.current.apparentTemperature);
    const currentTemp = Math.round(locationData.current.temperature2m);

    const temp = document.createElement('div');
    temp.classList.add('js-feels-temp');
    temp.textContent = systemType === 'metric' ? `${feelsLikeTemp}${degreeIcon}` : Math.round(`${feelsLikeTemp}${degreeIcon}` * (9 / 5)) + 32;

    const desc = document.createElement('div');
    desc.classList.add('js-feels-desc');

    const tempDif = feelsLikeTemp - currentTemp;
    if (systemType === 'metric') {
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
    const index = Math.round(locationData.hourly.uvIndex[0]);

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
        indexDesc.textContent = 'You can safely stay outside.';
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

const updateSunriseSunset = (locationData) => {
    const sunriseSunset = document.querySelector('.sunrise-sunset');
    const card = sunriseSunset.querySelector('.card-content');
    const title = sunriseSunset.querySelector('.card-title');
    const cardTitleIcon = title.querySelector('.card-title-icon');
    const cardTitleText = title.querySelector('.card-title-text');

    const mainTime = document.createElement('div');
    mainTime.classList.add('js-sunrise-sunset-main-time');
    const nextTime = document.createElement('div');
    nextTime.classList.add('js-sunrise-sunset-next-time');

    const { timezone } = locationData.location;
    const sunriseToday = locationData.daily.sunriseSunset[0].sunrise;
    const sunsetToday = locationData.daily.sunriseSunset[0].sunset;
    const currentTime = formatDateTimezone(timezone, new Date());

    if (currentTime.getTime() > formatDateTimezone(timezone, new Date(sunriseToday)).getTime()
    && currentTime.getTime() < formatDateTimezone(timezone, new Date(sunsetToday)).getTime()) {
        cardTitleText.textContent = 'Sunset';
        cardTitleIcon.src = sunset;
        cardTitleIcon.alt = 'Sunset icon';
        mainTime.textContent = sunsetToday.slice(11, 16);
        nextTime.textContent = `Sunrise: ${locationData.daily.sunriseSunset[1].sunrise.slice(11, 16)}`;
    // eslint-disable-next-line max-len
    } else if (currentTime.getTime() > formatDateTimezone(timezone, new Date(sunriseToday)).getTime()
    && currentTime.getTime() > formatDateTimezone(timezone, new Date(sunsetToday)).getTime()) {
        cardTitleText.textContent = 'Sunrise';
        cardTitleIcon.src = sunrise;
        cardTitleIcon.alt = 'Sunrise icon';
        mainTime.textContent = locationData.daily.sunriseSunset[1].sunrise.slice(11, 16);
        nextTime.textContent = `Sunset: ${locationData.daily.sunriseSunset[1].sunset.slice(11, 16)}`;
    // eslint-disable-next-line max-len
    } else if (currentTime.getTime() < formatDateTimezone(timezone, new Date(sunriseToday)).getTime()) {
        cardTitleText.textContent = 'Sunrise';
        cardTitleIcon.src = sunrise;
        cardTitleIcon.alt = 'Sunrise icon';
        mainTime.textContent = locationData.daily.sunriseSunset[0].sunrise.slice(11, 16);
        nextTime.textContent = `Sunset: ${sunsetToday.slice(11, 16)}`;
    }

    card.append(mainTime, nextTime);
};

const updateWind = (locationData, systemType) => {
    const wind = document.querySelector('.wind');
    const card = wind.querySelector('.card-content');
    const windType = card.querySelector('.wind-type-wind');
    const windSpeed = windType.querySelector('.wind-left');
    const windMetric = windType.querySelector('.wind-metric');
    const gustType = card.querySelector('.wind-type-gust');
    const gustSpeed = gustType.querySelector('.wind-left');
    const gustMetric = gustType.querySelector('.wind-metric');
    const windDirection = card.querySelector('.wind-direction');
    const direction = windDirection.querySelector('p');
    const arrow = windDirection.querySelector('.arrow');

    windMetric.textContent = systemType === 'metric' ? 'KM/H' : 'MP/H';
    gustMetric.textContent = systemType === 'metric' ? 'KM/H' : 'MP/H';

    const directionDegree = Math.round(locationData.current.windDirection10m);
    arrow.style.transform = `rotate(${Math.round(directionDegree)}deg)`;

    if (directionDegree >= 336 || directionDegree <= 24) {
        direction.textContent = 'N';
    } else if (directionDegree >= 25 && directionDegree <= 65) {
        direction.textContent = 'NE';
    } else if (directionDegree >= 66 && directionDegree <= 114) {
        direction.textContent = 'E';
    } else if (directionDegree >= 115 && directionDegree <= 155) {
        direction.textContent = 'SE';
    } else if (directionDegree >= 156 && directionDegree <= 204) {
        direction.textContent = 'S';
    } else if (directionDegree >= 205 && directionDegree <= 245) {
        direction.textContent = 'SW';
    } else if (directionDegree >= 246 && directionDegree <= 294) {
        direction.textContent = 'W';
    } else if (directionDegree >= 295 && directionDegree <= 335) {
        direction.textContent = 'NW';
    }

    windSpeed.textContent = systemType === 'metric' ? Math.round(locationData.current.windSpeed10m) : Math.round(locationData.current.windSpeed10m / 1.609344);
    gustSpeed.textContent = systemType === 'metric' ? Math.round(locationData.current.windGusts10m) : Math.round(locationData.current.windGusts10m / 1.609344);
};

const updatePressure = (locationData) => {
    pressureGauge(Math.round(locationData.current.pressureMsl));
};

const getWeatherInfo = (locationData, systemType) => {
    updateBriefInfo(locationData, systemType);
    updateWeatherBackground(locationData);
    updateHourlyForecast(locationData, systemType);
    updateDailyForecast(locationData, systemType);
    updatePrecipitationMap(locationData);
    updateFeelsLike(locationData, systemType);
    updateUvIndex(locationData);
    updateSunriseSunset(locationData);
    updateWind(locationData, systemType);
    updatePressure(locationData);
};

const updateCardWeatherBackground = (locationData, card) => {
    const weatherType = getWeatherType(
        locationData.current.weatherCode,
        locationData.current.isDay,
    );

    const bgFile = getWeatherBackground(locationData);
    card.style.backgroundImage = `url(${bgFile})`;

    if (locationData.current.isDay === 0) {
        switch (weatherType.background) {
            case 'clear':
                card.style.backgroundPosition = 'top';
                break;
            case 'cloudy':
                card.style.backgroundPosition = 'top right';
                break;
            case 'very-cloudy':
                card.style.backgroundPosition = 'top center';
                break;
            case 'fog':
                card.style.backgroundPosition = 'top center';
                break;
            case 'light-rain':
                card.style.backgroundPosition = 'center';
                break;
            case 'rain':
                card.style.backgroundPosition = 'center';
                break;
            case 'heavy-rain':
                card.style.backgroundPosition = 'center';
                break;
            case 'light-snow':
                card.style.backgroundPosition = 'center';
                break;
            case 'snow':
                card.style.backgroundPosition = 'center';
                break;
            case 'heavy-snow':
                card.style.backgroundPosition = 'center';
                break;
            case 'thunderstorm':
                card.style.backgroundPosition = 'center right';
                break;
            default:
                card.style.background = 'rgb(0 41 96)';
        }
    } else {
        switch (weatherType.background) {
            case 'sunny':
                card.style.backgroundPosition = 'top';
                break;
            case 'cloudy':
                card.style.backgroundPosition = 'top';
                break;
            case 'very-cloudy':
                card.style.backgroundPosition = 'top';
                break;
            case 'fog':
                card.style.backgroundPosition = 'top center';
                break;
            case 'light-rain':
                card.style.backgroundPosition = 'center';
                break;
            case 'rain':
                card.style.backgroundPosition = 'center';
                break;
            case 'heavy-rain':
                card.style.backgroundPosition = 'center';
                break;
            case 'light-snow':
                card.style.backgroundPosition = 'center';
                break;
            case 'snow':
                card.style.backgroundPosition = 'center';
                break;
            case 'heavy-snow':
                card.style.backgroundPosition = 'center';
                break;
            case 'thunderstorm':
                card.style.backgroundPosition = 'center';
                break;
            default:
                card.style.background = '#248DC7';
        }
    }
};

const getCardInfo = (locationData, systemType) => {
    const cardsContainer = document.querySelector('.saved-locations-cards');
    const cardElements = cardsContainer.querySelectorAll('.location-card');
};

export { getWeatherInfo, getCardInfo };
