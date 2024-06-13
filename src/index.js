/* eslint-disable import/no-extraneous-dependencies */
import 'normalize.css';
import './index-style.css';
import getLocationData from './modules/weather';
import updateWeatherInfo from './modules/domController';

const locationData = getLocationData('london');
locationData.then((res) => console.log(res));
locationData.then((res) => updateWeatherInfo(res, 'C'));
