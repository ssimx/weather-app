/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import 'normalize.css';
import './index-style.css';
import './styles/saved-locations-style.css';
import { getWeatherInfo, getCardsInfo } from './modules/domController';
import locations from './modules/locations';
import { getCoords } from './modules/weather';

const bodyDiv = document.querySelector('body');
const cardsContainer = document.querySelector('.saved-locations-cards');
const savedLocationsDiv = bodyDiv.querySelector('#saved-locations');
const headerBtns = bodyDiv.querySelector('.header-buttons');
const savedLocationsMenuBtn = bodyDiv.querySelector('#saved-locations-btn');
const cancelBtn = bodyDiv.querySelector('#cancel-btn');
const saveBtn = bodyDiv.querySelector('#save-btn');
const locationDiv = bodyDiv.querySelector('#location');
const picker = document.querySelector('gmpx-place-picker');
let searchLocation;

// create or get saved locations list,
// render the first location and render menu cards of all saved locations in the background
locations();
getWeatherInfo(locations().get()[0].city, 0);
getCardsInfo(0);

// ADD SYLE FOR SEARCH INPUT
const gmpx = document.querySelector('gmpx-place-picker');
const style = document.createElement('style');
style.innerHTML = '.pac-target-input { border-radius: 10px; border: none; font-size: 1rem; } .pac-target-input:focus { outline: none; } .icon { transform: scale(1.5); color: #757575; }';
gmpx.shadowRoot.appendChild(style);

// FUNCTION FOR TOGGLING HEADER BUTTONS BUTTONS (MENU/CLOSE/SAVE)
const toggleHeaderButtons = () => {
    savedLocationsMenuBtn.classList.toggle('btn-hidden');
    cancelBtn.classList.toggle('btn-hidden');
    saveBtn.classList.toggle('btn-hidden');
};

// EVENT LISTENER FUNCTION: FOR LOCATION SEARCH CLICK
const handleSearchClick = async (event) => {
    searchLocation = await getCoords(event.target.value.formattedAddress);
    if (!locations().exists(searchLocation.place_id)) {
        toggleHeaderButtons();
    }
    getWeatherInfo(event.target.value.formattedAddress, 0);

    locationDiv.style.display = '';
    locationDiv.classList.toggle('visible');

    savedLocationsDiv.classList.toggle('visible');
    savedLocationsDiv.style.display = 'none';

    const input = picker.shadowRoot.querySelector('input');
    input.value = '';

    removeListeners();
};

// EVENT LISTENER FUNCTION: FOR SAVED LOCATION CARD CLICK
const handleCardClick = (event) => {
    const cardLocationIndex = event.target.closest('.location-card').dataset.index;
    getWeatherInfo(locations().get()[cardLocationIndex].city, 0);

    savedLocationsDiv.style.display = 'none';
    savedLocationsDiv.classList.toggle('visible');

    locationDiv.classList.toggle('visible');
    locationDiv.style.display = '';

    removeListeners();
};

// EVENT LISTENER FUNCTION: FOR HEADER BUTTONS CLICK
const handleHeaderBtnClick = (event) => {
    if (event.target.closest('#saved-locations-btn') || event.target.closest('#cancel-btn')) {
        // If MENU or CANCEL btn is clicked
        // hide location div
        // show saved locations div
        locationDiv.style.display = 'none';
        locationDiv.classList.toggle('visible');

        savedLocationsDiv.classList.toggle('visible');
        savedLocationsDiv.style.display = '';

        // add event listener for searching locations
        picker.addEventListener('gmpx-placechange', handleSearchClick);

        // add event listener for clicking on saved location card
        cardsContainer.addEventListener('click', handleCardClick);

        // if CANCEL btn is clicked, reset header buttons to default visibility
        // neccessary for toggle function to properly show/hide buttons
        if (event.target.closest('#cancel-btn')) {
            toggleHeaderButtons();
        }
    } else if (event.target.closest('#save-btn')) {
        // Check if location is already saved in storage
        // If not, save it and toggle header buttons to show menu again
        if (!locations().exists(searchLocation.place_id)) {
            locations().add(
                searchLocation.address_components[0].long_name,
                searchLocation.geometry.location.lat,
                searchLocation.geometry.location.lng,
                searchLocation.place_id,
            );

            getWeatherInfo(searchLocation.address_components[0].long_name, 0);
            getCardsInfo(0);
            toggleHeaderButtons();
        } else {
            console.log('Cant save');
        }
    }
};

// FOR REMOVING ABOVE ACTIVE EVENT LISTENERS
const removeListeners = () => {
    picker.removeEventListener('gmpx-placechange', handleSearchClick);
    cardsContainer.removeEventListener('click', handleCardClick);
};

// EVENT LISTENER FOR HEADER BUTTONS
headerBtns.addEventListener('click', handleHeaderBtnClick);
