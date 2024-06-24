/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-plusplus */
import { fetchWeatherApi } from 'openmeteo';
import formatDateTimezone from './timezoneFormatter';

const range = require('lodash.range');

const getCoords = async (location) => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=AIzaSyDqnHb0ScTTw8WWCAH2NabxjSqDTjkV-cY`, { mode: 'cors' });

        const data = await response.json();

        return data.results[0];
    } catch (err) {
        return err;
    }
};

const getLocationName = async (latitude, longitude) => {
    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDqnHb0ScTTw8WWCAH2NabxjSqDTjkV-cY`, { mode: 'cors' });

        const data = await response.json();

        return data.results[0];
    } catch (err) {
        return err;
    }
};

const getSunriseSunset = async (latitude, longitude, timezone) => {
    try {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow = new Date(tomorrow.toLocaleString('en', { timeZone: timezone }));

        const responseToday = await fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=today&tzid=${timezone}&formatted=0`, { mode: 'cors' });
        const responseTomorrow = await fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()}&tzid=${timezone}&formatted=0`, { mode: 'cors' });

        const dataToday = await responseToday.json();
        const dataTomorrow = await responseTomorrow.json();

        return [dataToday.results, dataTomorrow.results];
    } catch (err) {
        return err;
    }
};

// eslint-disable-next-line max-len
export default async function getLocationData(cityArray, latitudeArray, longitudeArray, locationIdArray, systemType) {
    const params = {
        latitude: [...latitudeArray],
        longitude: [...longitudeArray],
        current: ['temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'precipitation', 'weather_code', 'is_day', 'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m', 'pressure_msl'],
        hourly: ['temperature_2m', 'precipitation', 'weather_code', 'uv_index', 'is_day'],
        daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'uv_index_max'],
        timezone: 'auto',
        past_days: 7,
        forecast_days: 14,
        forecast_hours: 24,
        temperature_unit: systemType === 0 ? 'celsius' : 'fahrenheit',
    };

    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);

    const weatherData = [];

    // Process all locations
    responses.forEach((response, index) => {
        // Attributes for timezone and location
        const timezone = response.timezone();
        const current = response.current();
        const hourly = response.hourly();
        const daily = response.daily();

        // Get sunrise and sunset data

        // Note: The order of weather variables in the URL query and the indices below need to match
        weatherData.push({
            location: {
                city: cityArray[index],
                timezone,
                latitude: latitudeArray[index],
                longitude: longitudeArray[index],
                locationId: locationIdArray[index],
            },
            current: {
                time: formatDateTimezone(timezone, new Date()),
                temperature2m: current.variables(0).value(),
                relativeHumidity2m: current.variables(1).value(),
                apparentTemperature: current.variables(2).value(),
                precipitation: current.variables(3).value(),
                weatherCode: current.variables(4).value(),
                isDay: current.variables(5).value(),
                windSpeed10m: current.variables(6).value(),
                windDirection10m: current.variables(7).value(),
                windGusts10m: current.variables(8).value(),
                pressureMsl: current.variables(9).value(),
            },
            hourly: {
                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                    (t) => formatDateTimezone(timezone, new Date(t * 1000)),
                ),
                temperature2m: hourly.variables(0).valuesArray(),
                precipitation: hourly.variables(1).valuesArray(),
                weatherCode: hourly.variables(2).valuesArray(),
                uvIndex: hourly.variables(3).valuesArray(),
                isDay: hourly.variables(4).valuesArray(),
            },
            daily: {
                time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                    (t) => formatDateTimezone(timezone, new Date(t * 1000)),
                ),
                weatherCode: daily.variables(0).valuesArray(),
                temperature2mMax: daily.variables(1).valuesArray(),
                temperature2mMin: daily.variables(2).valuesArray(),
                uvIndexMax: daily.variables(3).valuesArray(),
            },

        });
    });
    return weatherData;
}

export { getCoords, getLocationName, getSunriseSunset };
