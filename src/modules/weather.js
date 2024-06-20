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

const getSunriseSunset = async (location, timezone) => {
    try {
        let tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow = new Date(tomorrow.toLocaleString('en', { timeZone: timezone }));

        const responseToday = await fetch(`https://api.sunrise-sunset.org/json?lat=${location.latitude}&lng=${location.longitude}&date=today&tzid=${timezone}&formatted=0`, { mode: 'cors' });
        const responseTomorrow = await fetch(`https://api.sunrise-sunset.org/json?lat=${location.latitude}&lng=${location.longitude}&date=${tomorrow.getFullYear()}-${tomorrow.getMonth()}-${tomorrow.getDate()}&tzid=${timezone}&formatted=0`, { mode: 'cors' });

        const dataToday = await responseToday.json();
        const dataTomorrow = await responseTomorrow.json();

        return [dataToday.results, dataTomorrow.results];
    } catch (err) {
        return err;
    }
};

export default async function getLocationData(location) {
    const locationData = await getCoords(location);

    const locationCoords = {
        latitude: locationData.geometry.location.lat,
        longitude: locationData.geometry.location.lng,
    };

    const params = {
        latitude: locationCoords.latitude,
        longitude: locationCoords.longitude,
        current: ['temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'precipitation', 'weather_code', 'is_day', 'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m', 'pressure_msl'],
        hourly: ['temperature_2m', 'precipitation', 'weather_code', 'uv_index', 'is_day'],
        daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'uv_index_max'],
        timezone: 'auto',
        past_days: 7,
        forecast_days: 14,
        forecast_hours: 24,
    };

    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);

    // Process first location
    const response = responses[0];

    // Attributes for timezone and location
    const timezone = response.timezone();
    const current = response.current();
    const hourly = response.hourly();
    const daily = response.daily();

    // Get sunrise and sunset data
    const sunriseSunset = await getSunriseSunset(locationCoords, timezone);

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        location: {
            name: locationData.address_components[0].short_name,
            timezone,
            latitude: locationCoords.latitude,
            longitude: locationCoords.longitude,
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
            sunriseSunset,
        },

    };
    return weatherData;
}
