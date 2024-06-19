/* eslint-disable import/no-extraneous-dependencies */
import 'normalize.css';
import './index-style.css';
import './styles/saved-locations-style.css';
import getLocationData from './modules/weather';
import { getWeatherInfo, getCardInfo } from './modules/domController';

const locationData = getLocationData('los angeles');
locationData.then((res) => console.log(res));
locationData.then((res) => getWeatherInfo(res, 'metric'));
locationData.then((res) => getCardInfo(res, 'metric'));

const bodyDiv = document.querySelector('body');
const savedLocationsBtn = bodyDiv.querySelector('#saved-locations-btn');
const locationDiv = bodyDiv.querySelector('#location');
const savedLocationsDiv = bodyDiv.querySelector('#saved-locations');

savedLocationsBtn.addEventListener('click', (e) => {
    locationDiv.style.display = 'none';
    locationDiv.classList.toggle('visible');

    savedLocationsDiv.classList.toggle('visible');
    savedLocationsDiv.style.display = '';
});
