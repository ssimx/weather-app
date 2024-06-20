/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import 'normalize.css';
import './index-style.css';
import './styles/saved-locations-style.css';
import getLocationData, { getCoords } from './modules/weather';
import { getWeatherInfo, getCardsInfo } from './modules/domController';
import locations from './modules/locations';

// get saved locations list, render the first one
locations();

getWeatherInfo(locations().get()[0].city, 0);
getCardsInfo(0);

const bodyDiv = document.querySelector('body');
const savedLocationsBtn = bodyDiv.querySelector('#saved-locations-btn');
const locationDiv = bodyDiv.querySelector('#location');
const savedLocationsDiv = bodyDiv.querySelector('#saved-locations');

// ADD SYLE FOR SEARCH INPUT
const gmpx = document.querySelector('gmpx-place-picker');
const style = document.createElement('style');
style.innerHTML = '.pac-target-input { border-radius: 10px; border: none; font-size: 1rem; } .pac-target-input:focus { outline: none; } .icon { transform: scale(1.5); color: #757575; }';
gmpx.shadowRoot.appendChild(style);

// EVENT LISTENER FOR SAVED LOCATIONS MENU
savedLocationsBtn.addEventListener('click', (e) => {
    locationDiv.style.display = 'none';
    locationDiv.classList.toggle('visible');

    savedLocationsDiv.classList.toggle('visible');
    savedLocationsDiv.style.display = '';

    // EVENT LISTENER FOR SEARCH INPUT CHANGE, RENDER THE CHOSEN LOCATION
    const picker = document.querySelector('gmpx-place-picker');
    const input = picker.shadowRoot.querySelector('input');
    const handleSearchClick = (event) => {
        const location = event.target.value.formattedAddress;
        getWeatherInfo(location, 0);

        locationDiv.style.display = '';
        locationDiv.classList.toggle('visible');

        savedLocationsDiv.classList.toggle('visible');
        savedLocationsDiv.style.display = 'none';

        input.value = '';
        removeMenuListeners();
    };
    picker.addEventListener('gmpx-placechange', handleSearchClick);

    // EVENT LISTENER FOR CARDS
    const cardsContainer = document.querySelector('.saved-locations-cards');
    const handleCardClick = (event) => {
        const cardLocationIndex = event.target.closest('.location-card').dataset.index;
        getWeatherInfo(locations().get()[cardLocationIndex].city, 0);

        savedLocationsDiv.style.display = 'none';
        savedLocationsDiv.classList.toggle('visible');

        locationDiv.classList.toggle('visible');
        locationDiv.style.display = '';

        removeMenuListeners();
    };
    cardsContainer.addEventListener('click', handleCardClick);

    function removeMenuListeners() {
        cardsContainer.removeEventListener('click', handleCardClick);
        picker.removeEventListener('gmpx-placechange', handleSearchClick);
    }
});
