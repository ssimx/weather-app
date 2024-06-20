/* eslint-disable import/no-extraneous-dependencies */
import 'normalize.css';
import './index-style.css';
import './styles/saved-locations-style.css';
import getLocationData from './modules/weather';
import { getWeatherInfo, getCardInfo } from './modules/domController';
import locations from './modules/locations';

// get saved locations list, render the first one
locations();

const locationData = getLocationData(locations().get()[0]);
locationData.then((res) => console.log(res));
locationData.then((res) => getWeatherInfo(res, 'metric'));
locationData.then((res) => getCardInfo(res, 'metric'));

const bodyDiv = document.querySelector('body');
const savedLocationsBtn = bodyDiv.querySelector('#saved-locations-btn');
const locationDiv = bodyDiv.querySelector('#location');
const savedLocationsDiv = bodyDiv.querySelector('#saved-locations');

// EVENT LISTENER FOR SAVED LOCATIONS MENU
savedLocationsBtn.addEventListener('click', (e) => {
    locationDiv.style.display = 'none';
    locationDiv.classList.toggle('visible');

    savedLocationsDiv.classList.toggle('visible');
    savedLocationsDiv.style.display = '';

    const picker = document.querySelector('gmpx-place-picker');
    const input = picker.shadowRoot.querySelector('input');

    // EVENT LISTENER FOR SEARCH INPUT CHANGE, RENDER THE CHOSEN LOCATION
    picker.addEventListener('gmpx-placechange', (event) => {
        const location = event.target.value.formattedAddress ?? '';
        const searchLocatioNData = getLocationData(location);
        searchLocatioNData.then((res) => console.log(res));
        searchLocatioNData.then((res) => getWeatherInfo(res, 'metric'));
        searchLocatioNData.then((res) => getCardInfo(res, 'metric'));


        locationDiv.style.display = '';
        locationDiv.classList.toggle('visible');

        savedLocationsDiv.classList.toggle('visible');
        savedLocationsDiv.style.display = 'none';

        input.value = '';
    });
});
