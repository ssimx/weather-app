/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import 'normalize.css';
import './index-style.css';
import './styles/saved-locations-style.css';
import { getWeatherInfo, getCardsInfo } from './modules/domController';
import locations from './modules/locations';
import { getCoords } from './modules/weather';

// create or get saved locations list,
// render the first one and render menu cards of saved locations in the background
locations();
getWeatherInfo(locations().get()[0].city, 0);
getCardsInfo(0);

const bodyDiv = document.querySelector('body');
const savedLocationsBtn = bodyDiv.querySelector('#saved-locations-btn');
const cancelBtn = bodyDiv.querySelector('#cancel-btn');
const saveBtn = bodyDiv.querySelector('#save-btn');
const locationDiv = bodyDiv.querySelector('#location');
const savedLocationsDiv = bodyDiv.querySelector('#saved-locations');

// ADD SYLE FOR SEARCH INPUT
const gmpx = document.querySelector('gmpx-place-picker');
const style = document.createElement('style');
style.innerHTML = '.pac-target-input { border-radius: 10px; border: none; font-size: 1rem; } .pac-target-input:focus { outline: none; } .icon { transform: scale(1.5); color: #757575; }';
gmpx.shadowRoot.appendChild(style);

// EVENT LISTENER FOR SAVED LOCATIONS MENU
savedLocationsBtn.addEventListener('click', (e) => {
    const headerBtns = bodyDiv.querySelector('.header-buttons');

    locationDiv.style.display = 'none';
    locationDiv.classList.toggle('visible');

    savedLocationsDiv.classList.toggle('visible');
    savedLocationsDiv.style.display = '';

    // HANDLE ADDING NEW LOCATIONS
    const handleNewLocationBtns = (event, location) => {
        savedLocationsBtn.style.display = '';
        cancelBtn.style.display = 'none';
        saveBtn.style.display = 'none';

        if (event.target.closest('#cancel-btn')) {
            locationDiv.style.display = 'none';
            locationDiv.classList.toggle('visible');
            savedLocationsDiv.classList.toggle('visible');
            savedLocationsDiv.style.display = '';
        } else if (event.target.closest('#save-btn')) {
            if (!locations().exists(location.place_id)) {
                locations().add(
                    location.address_components[0].long_name,
                    location.geometry.location.lat,
                    location.geometry.location.lng,
                    location.place_id,
                );

                getWeatherInfo(location.address_components[0].long_name, 0);
                getCardsInfo(0);
                removeMenuListeners();
            } else {
                console.log('Cant save');
            }
        }
    };

    const enableNewLocationButtons = (location) => {
        savedLocationsBtn.style.display = 'none';
        cancelBtn.style.display = '';
        saveBtn.style.display = '';

        headerBtns.addEventListener('click', (event) => handleNewLocationBtns(event, location));
    };

    // EVENT LISTENER FOR SEARCH INPUT CHANGE, RENDER THE CHOSEN LOCATION
    const picker = document.querySelector('gmpx-place-picker');
    const input = picker.shadowRoot.querySelector('input');
    const handleSearchClick = async (event) => {
        const searchLocation = await getCoords(event.target.value.formattedAddress);
        if (!locations().exists(searchLocation.place_id)) {
            enableNewLocationButtons(searchLocation);
        }
        getWeatherInfo(event.target.value.formattedAddress, 0);

        locationDiv.style.display = '';
        locationDiv.classList.toggle('visible');

        savedLocationsDiv.classList.toggle('visible');
        savedLocationsDiv.style.display = 'none';

        input.value = '';
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
        headerBtns.removeEventListener('click', handleNewLocationBtns);
    }
});
