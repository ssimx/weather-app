/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-plusplus */
import { fetchWeatherApi } from 'openmeteo';

const range = require('lodash.range');

const getCoords = async (location) => {
    try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`, { mode: 'cors' });

        const data = await response.json();
        return data.results[0];
    } catch (err) {
        return err;
    }
};

export default async function getLocationData(location) {
    const locationCoords = await getCoords(location);

    const params = {
        latitude: locationCoords.latitude,
        longitude: locationCoords.longitude,
        current: ['temperature_2m', 'relative_humidity_2m', 'apparent_temperature', 'precipitation', 'weather_code', 'is_day'],
        hourly: ['temperature_2m', 'precipitation', 'weather_code', 'uv_index', 'is_day'],
        daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min', 'uv_index_max', 'sunset', 'sunrise'],
        forecast_days: 14,
        forecast_hours: 24,
    };

    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);

    // Process first location
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const current = response.current();
    const hourly = response.hourly();
    const daily = response.daily();

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        location: {
            name: locationCoords.name,
        },
        current: {
            time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
            temperature2m: current.variables(0).value(),
            relativeHumidity2m: current.variables(1).value(),
            apparentTemperature: current.variables(2).value(),
            precipitation: current.variables(3).value(),
            weatherCode: current.variables(4).value(),
            isDay: current.variables(5).value(),
        },
        hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000),
            ),
            temperature2m: hourly.variables(0).valuesArray(),
            precipitation: hourly.variables(1).valuesArray(),
            weatherCode: hourly.variables(2).valuesArray(),
            uvIndex: hourly.variables(3).valuesArray(),
            isDay: hourly.variables(4).valuesArray(),
        },
        daily: {
            time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000),
            ),
            weatherCode: daily.variables(0).valuesArray(),
            temperature2mMax: daily.variables(1).valuesArray(),
            temperature2mMin: daily.variables(2).valuesArray(),
            uvIndexMax: daily.variables(3).valuesArray(),
            sunset: daily.variables(4).valuesArray(),
            sunrise: daily.variables(5).valuesArray(),
        },

    };
    return weatherData;
}
