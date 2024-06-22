/* eslint-disable no-unused-expressions */
/* eslint-disable no-lonely-if */
/* eslint-disable no-plusplus */
import '../styles/brief-info-style.css';
import '../styles/hourly-forecast-style.css';
import '../styles/daily-forecast-style.css';
import '../styles/feels-like-style.css';
import '../styles/uv-index-style.css';
import '../styles/sunrise-sunset-style.css';
import '../styles/wind-style.css';
import '../styles/pressure-style.css';
import '../styles/settings-style.css';
import locations from './locations';
import getLocationData, { getCoords, getSunriseSunset } from './weather';
import createTempBarElement from './tempBar';
import formatDateTimezone from './timezoneFormatter';
import pressureGauge from './pressureGauge';
import renderPrecipitationMap from './precipitationMap';
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
import removeIcon from '../assets/icons/remove.svg';
import reorderIcon from '../assets/icons/reorder.svg';
import { getStorage } from './localStorage';

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
        locationDiv.style.backgroundPosition = `var(--main-bg-position-${weatherType.background}-night)`;
    } else {
        locationDiv.style.backgroundPosition = `var(--main-bg-position-${weatherType.background}-day)`;
    }
};

const updateBriefInfo = (locationData) => {
    const locationBriefInfo = document.querySelector('.location-brief-info');
    const cityElement = locationBriefInfo.querySelector('.city');
    const tempNumberElement = locationBriefInfo.querySelector('.temp-number');
    const tempIconElement = locationBriefInfo.querySelector('.temp-icon');
    const typeElement = locationBriefInfo.querySelector('.type');
    const tempMaxElement = locationBriefInfo.querySelector('.temp-high');
    const tempMinElement = locationBriefInfo.querySelector('.temp-low');

    cityElement.textContent = locationData.location.city;

    const currentTemp = Math.round(locationData.current.temperature2m);
    const tempMax = Math.round(locationData.daily.temperature2mMax[0]);
    const tempMin = Math.round(locationData.daily.temperature2mMin[0]);

    tempNumberElement.textContent = `${currentTemp}`;
    tempIconElement.textContent = `${degreeIcon}`;
    tempMaxElement.textContent = `H:${tempMax}${degreeIcon}`;
    tempMinElement.textContent = `L:${tempMin}${degreeIcon}`;

    const weatherType = getWeatherType(
        locationData.current.weatherCode,
        locationData.current.isDay,
    );
    typeElement.textContent = weatherType.description;
};

const updateHourlyForecast = (locationData) => {
    const hourly = document.querySelector('.hourly-forecast');
    const card = hourly.querySelector('.card-content');
    card.textContent = '';

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
        const temp = Math.round(locationData.hourly.temperature2m[i]);
        hourTemp.textContent = `${temp}${degreeIcon}`;

        item.append(hourTime, hourWeatherType, hourTemp);
        card.append(item);
    }
};

const updateDailyForecast = (locationData) => {
    const daily = document.querySelector('.daily-forecast');
    const card = daily.querySelector('.card-content');
    card.textContent = '';

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

        const minTemp = Math.round(locationData.daily.temperature2mMin[i]);
        minTempElement.textContent = `${minTemp}${degreeIcon}`;

        const maxTemp = Math.round(locationData.daily.temperature2mMax[i]);
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
    card.textContent = '';

    const feelsLikeTemp = Math.round(locationData.current.apparentTemperature);
    const currentTemp = Math.round(locationData.current.temperature2m);

    const temp = document.createElement('div');
    temp.classList.add('js-feels-temp');
    temp.textContent = `${feelsLikeTemp}${degreeIcon}`;

    const desc = document.createElement('div');
    desc.classList.add('js-feels-desc');

    const tempDif = feelsLikeTemp - currentTemp;
    if (systemType === 0) {
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
    card.textContent = '';

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

const updateSunriseSunset = async (locationData) => {
    const sunriseSunset = document.querySelector('.sunrise-sunset');
    const card = sunriseSunset.querySelector('.card-content');
    card.textContent = '';

    const title = sunriseSunset.querySelector('.card-title');
    const cardTitleIcon = title.querySelector('.card-title-icon');
    const cardTitleText = title.querySelector('.card-title-text');

    const mainTime = document.createElement('div');
    mainTime.classList.add('js-sunrise-sunset-main-time');
    const nextTime = document.createElement('div');
    nextTime.classList.add('js-sunrise-sunset-next-time');

    const { latitude, longitude, timezone } = locationData.location;
    const sunriseSunsetInfo = await getSunriseSunset(latitude, longitude, timezone);
    const sunriseToday = sunriseSunsetInfo[0].sunrise;
    const sunsetToday = sunriseSunsetInfo[0].sunset;
    const currentTime = formatDateTimezone(timezone, new Date());

    if (currentTime.getTime() > formatDateTimezone(timezone, new Date(sunriseToday)).getTime()
    && currentTime.getTime() < formatDateTimezone(timezone, new Date(sunsetToday)).getTime()) {
        cardTitleText.textContent = 'Sunset';
        cardTitleIcon.src = sunset;
        cardTitleIcon.alt = 'Sunset icon';
        mainTime.textContent = sunsetToday.slice(11, 16);
        nextTime.textContent = `Sunrise: ${sunriseSunsetInfo[1].sunrise.slice(11, 16)}`;
    // eslint-disable-next-line max-len
    } else if (currentTime.getTime() > formatDateTimezone(timezone, new Date(sunriseToday)).getTime()
    && currentTime.getTime() > formatDateTimezone(timezone, new Date(sunsetToday)).getTime()) {
        cardTitleText.textContent = 'Sunrise';
        cardTitleIcon.src = sunrise;
        cardTitleIcon.alt = 'Sunrise icon';
        mainTime.textContent = sunriseSunsetInfo[1].sunrise.slice(11, 16);
        nextTime.textContent = `Sunset: ${sunriseSunsetInfo[1].sunset.slice(11, 16)}`;
    // eslint-disable-next-line max-len
    } else if (currentTime.getTime() < formatDateTimezone(timezone, new Date(sunriseToday)).getTime()) {
        cardTitleText.textContent = 'Sunrise';
        cardTitleIcon.src = sunrise;
        cardTitleIcon.alt = 'Sunrise icon';
        mainTime.textContent = sunriseSunsetInfo[0].sunrise.slice(11, 16);
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
    const gaugeDiv = document.querySelector('.gauge-container');
    gaugeDiv.textContent = '';

    const pressureUnitText = document.createElement('p');
    pressureUnitText.classList.add('pressure-unit');
    pressureUnitText.textContent = 'hPa';
    gaugeDiv.append(pressureUnitText);

    pressureGauge(Math.round(locationData.current.pressureMsl));
};

const getWeatherInfo = async (location, systemType) => {
    const locationCoords = await getCoords([location]);
    const locationData = (await getLocationData(
        [locationCoords.address_components[0].long_name],
        [locationCoords.geometry.location.lat],
        [locationCoords.geometry.location.lng],
        [locationCoords.place_id],
        systemType,
    ))[0];

    console.log(locationData);
    updateBriefInfo(locationData);
    updateWeatherBackground(locationData);
    updateHourlyForecast(locationData);
    updateDailyForecast(locationData);
    updatePrecipitationMap(locationData);
    updateFeelsLike(locationData, systemType);
    updateUvIndex(locationData);
    updateSunriseSunset(locationData);
    updateWind(locationData, systemType);
    updatePressure(locationData);
};

const updateCardWeatherBackground = (locationData, card) => {
    const cardDiv = card;

    const weatherType = getWeatherType(
        locationData.current.weatherCode,
        locationData.current.isDay,
    );

    const bgFile = getWeatherBackground(locationData);
    cardDiv.style.backgroundImage = `url(${bgFile})`;

    if (locationData.current.isDay === 0) {
        cardDiv.style.backgroundPosition = `var(--card-bg-position-${weatherType.background}-night)`;
    } else {
        cardDiv.style.backgroundPosition = `var(--card-bg-position-${weatherType.background}-day)`;
    }
};

const createSavedLocationsCards = async (systemType) => {
    const savedLocations = locations().get();
    const cities = [];
    const latitudes = [];
    const longitudes = [];
    const locationIDs = [];
    const timezones = [];

    savedLocations.forEach((location) => {
        cities.push(location.city);
        latitudes.push(location.latitude);
        longitudes.push(location.longitude);
        locationIDs.push(location.locationId);
        timezones.push(location.timezone);
    });

    const cardsContainer = document.querySelector('.saved-locations-cards');
    cardsContainer.textContent = '';
    const locationsData = await getLocationData(
        cities, latitudes, longitudes, locationIDs, systemType);

    locationsData.forEach((location, index) => {
        const locationDiv = document.createElement('div');
        locationDiv.classList.add('location-container');
        locationDiv.dataset.index = index;

        const cardDiv = document.createElement('div');
        cardDiv.classList.add('location-card');
        updateCardWeatherBackground(location, cardDiv);

        const cardLeftDiv = document.createElement('div');
        cardLeftDiv.classList.add('location-card-left');
        const city = document.createElement('p');
        city.classList.add('city');
        city.textContent = location.location.city;

        const time = document.createElement('p');
        time.classList.add('time');

        const getFullHour = () => {
            const hours = new Date(location.current.time).getHours();
            if (hours < 10) {
                return `0${hours}`;
            }
            return hours;
        };

        const getFullMinutes = () => {
            const minutes = new Date(location.current.time).getMinutes();
            if (minutes < 10) {
                return `0${minutes}`;
            }
            return minutes;
        };

        time.textContent = `${getFullHour()}:${getFullMinutes()}`;

        const weather = document.createElement('p');
        weather.classList.add('weather');
        const weatherType = getWeatherType(
            location.current.weatherCode,
            location.current.isDay,
        );
        weather.textContent = weatherType.description;

        const cardRightDiv = document.createElement('div');
        cardRightDiv.classList.add('location-card-right');

        const currentTemp = document.createElement('p');
        currentTemp.classList.add('current-temp');
        currentTemp.textContent = `${Math.round(location.current.temperature2m)}${degreeIcon}`;

        const highMinTemp = document.createElement('div');
        highMinTemp.classList.add('high-min-temp');

        const highTemp = document.createElement('p');
        highTemp.classList.add('high-temp');
        highTemp.textContent = `L:${Math.round(location.daily.temperature2mMax[0])}`;

        const minTemp = document.createElement('p');
        minTemp.classList.add('min-temp');
        minTemp.textContent = `L:${Math.round(location.daily.temperature2mMin[0])}`;

        highMinTemp.append(highTemp, minTemp);
        cardLeftDiv.append(city, time, weather);
        cardRightDiv.append(currentTemp, highMinTemp);
        cardDiv.append(cardLeftDiv, cardRightDiv);
        locationDiv.append(cardDiv);
        cardsContainer.append(locationDiv);
    });
};

const getCardsInfo = (systemType) => {
    createSavedLocationsCards(systemType);
};

const toggleEditLocationsCards = () => {
    const cardsDiv = document.querySelector('.saved-locations-cards');
    const locationContainers = cardsDiv.querySelectorAll('.location-container');

    // for each container add remove/reorder elements and resize the card
    locationContainers.forEach((container) => {
        const containerDiv = container;

        // resize the card
        const locationCard = containerDiv.querySelector('.location-card');
        locationCard.style.width === '' ? locationCard.style.width = '80%' : locationCard.style.width = '';
        locationCard.style.height === '' ? locationCard.style.height = '7vh' : locationCard.style.height = '';
        locationCard.style.borderRadius === '' ? locationCard.style.borderRadius = '20px' : locationCard.style.borderRadius = '';
        locationCard.style.padding === '' ? locationCard.style.padding = '0 5px' : locationCard.style.padding = '';

        const cardChildren = locationCard.childNodes;
        cardChildren.forEach((child) => {
            const elementChild = child;
            elementChild.style.transform === '' ? elementChild.style.transform = 'scale(0.7)' : elementChild.style.transform = '';
        });

        // remove element
        if (containerDiv.querySelector('.remove-card-btn')) {
            containerDiv.querySelector('.remove-card-btn').remove();
        } else {
            const removeBtn = document.createElement('button');
            removeBtn.classList.add('remove-card-btn');
            const removeIcn = document.createElement('img');
            removeIcn.setAttribute('src', `${removeIcon}`);
            removeBtn.append(removeIcn);

            locationCard.insertAdjacentElement('beforebegin', removeBtn);
        }

        // reorder element
        if (containerDiv.querySelector('.reorder-card-btn')) {
            containerDiv.querySelector('.reorder-card-btn').remove();
        } else {
            const reorderBtn = document.createElement('button');
            reorderBtn.classList.add('reorder-card-btn');
            const reorderIcn = document.createElement('img');
            reorderIcn.setAttribute('src', `${reorderIcon}`);
            reorderBtn.append(reorderIcn);

            locationCard.insertAdjacentElement('afterend', reorderBtn);
        }
    });
};

const manageEditLocationsCards = (event) => {
    if (event.target.closest('.location-container')) {
        let cardsDiv = document.querySelector('.saved-locations-cards');
        const containerIndex = event.target.closest('.location-container').dataset.index;
        if (event.target.closest('.remove-card-btn')) {
            locations().remove(containerIndex);
            cardsDiv.removeChild(event.target.closest('.location-container'));

            // update card indexes
            cardsDiv = document.querySelector('.saved-locations-cards');
            const containers = cardsDiv.querySelectorAll('.location-container');
            containers.forEach((container, index) => {
                const containerDiv = container;
                containerDiv.dataset.index = index;
            });
        }
    } else {
        window.removeEventListener('mouseup', manageEditLocationsCards);
        toggleEditLocationsCards();
    }
};

const enableEditLocationsCards = () => {
    toggleEditLocationsCards();

    // add event listener for managing interactions
    window.addEventListener('mouseup', manageEditLocationsCards);
};

export { getWeatherInfo, getCardsInfo, enableEditLocationsCards };
