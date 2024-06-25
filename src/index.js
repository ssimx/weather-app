/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import 'normalize.css';
import './index-style.css';
import './styles/saved-locations-style.css';
import {
    getCurrentLocation,
    getWeatherInfo,
    getCardsInfo,
    enableEditLocationsCards,
} from './modules/domController';
import locations from './modules/locations';
import { getCoords, getLocationName } from './modules/weather';
import { setStorage, getStorage } from './modules/localStorage';
import checkIcon from './assets/icons/check.svg';

const bodyDiv = document.querySelector('body');
const cardsContainer = document.querySelector('.saved-locations-cards');
const settingsBtn = document.querySelector('.settings-btn');
const settingsMenu = document.querySelector('.settings-menu');
const savedLocationsDiv = bodyDiv.querySelector('#saved-locations');
const headerBtns = bodyDiv.querySelector('.header-buttons');
const savedLocationsMenuBtn = bodyDiv.querySelector('#saved-locations-btn');
const cancelBtn = bodyDiv.querySelector('#cancel-btn');
const saveBtn = bodyDiv.querySelector('#save-btn');
const locationDiv = bodyDiv.querySelector('#location');
const picker = document.querySelector('gmpx-place-picker');
let systemType;
let searchLocation;

// get or define system type
if (getStorage('systemType') === null) {
    systemType = 0;
    setStorage('systemType', systemType);
} else {
    systemType = getStorage('systemType');
}

// create or get saved locations list,
// render the first location and render menu cards of all saved locations in the background
locations();

// get current position if possible
const currentLocation = getCurrentLocation().catch((err) => console.log(err));
let currentLocationName;
currentLocation.then(async (res) => {
    if (res) {
        currentLocationName = await getLocationName(res.coords.latitude, res.coords.longitude);
        getWeatherInfo(currentLocationName.address_components[2].long_name, systemType);
    } else {
        getWeatherInfo(locations().get()[0].city, systemType);
    }
});
getCardsInfo(systemType);

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
    getWeatherInfo(event.target.value.formattedAddress, systemType);

    locationDiv.style.display = '';
    locationDiv.classList.toggle('visible');

    savedLocationsDiv.classList.toggle('visible');
    savedLocationsDiv.style.display = 'none';

    const input = picker.shadowRoot.querySelector('input');
    input.value = '';

    const clear = picker.shadowRoot.querySelector('.clear-button');
    clear.setAttribute('hidden', '');

    removeListeners();
};

// EVENT LISTENER FUNCTION: FOR SAVED LOCATION CARD CLICK
const handleCardClick = (event) => {
    if (event.target.closest('.location-card')) {
        const cardLocationIndex = event.target.closest('.location-container').dataset.index;

        if (cardLocationIndex === 'default') {
            getWeatherInfo(currentLocationName.address_components[2].long_name, systemType);
        } else {
            getWeatherInfo(locations().get()[cardLocationIndex].city, systemType);
        }

        savedLocationsDiv.style.display = 'none';
        savedLocationsDiv.classList.toggle('visible');

        locationDiv.classList.toggle('visible');
        locationDiv.style.display = '';

        removeListeners();
    }
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

// EVENT LISTENER FUNCTION: FOR SETTINGS MENU ITEMS
const handleSettingsMenuClick = (event) => {
    const menuItem = event.target.closest('.settings-option');
    settingsMenu.classList.toggle('hidden-menu');
    window.removeEventListener('mouseup', handleSettingsMenuClick);

    if (event.target.closest('.settings-option')) {
        if (menuItem.classList.contains('edit-list')) {
            const savedLocationsCount = locations().get().length;

            if (savedLocationsCount !== 0) {
                enableEditLocationsCards();
            }
        } else if (menuItem.classList.contains('metric')) {
            if (systemType === 1) {
                systemType = 0;
                setStorage('systemType', systemType);
                getCardsInfo(systemType);
            }
        } else if (menuItem.classList.contains('imperial')) {
            if (systemType === 0) {
                systemType = 1;
                setStorage('systemType', systemType);
                console.log('test');
                getCardsInfo(systemType);
            }
        }
    }
};

// EVENT LISTENER FUNCTION: FOR SETTINGS BUTTON
const handleSettingsBtn = () => {
    settingsMenu.classList.toggle('hidden-menu');
    const metricItem = settingsMenu.querySelector('.metric');
    const imperialItem = settingsMenu.querySelector('.imperial');
    const metricCheckIcon = metricItem.querySelector('.check-icon');
    const imperialCheckIcon = imperialItem.querySelector('.check-icon');
    metricCheckIcon.src = '';
    imperialCheckIcon.src = '';

    if (systemType === 0) {
        metricCheckIcon.src = checkIcon;
    } else {
        imperialCheckIcon.src = checkIcon;
    }

    const menuItem = settingsMenu.querySelector('.edit-list');
    const savedLocationsCount = locations().get().length;

    if (savedLocationsCount === 0) {
        menuItem.style.backgroundColor = 'rgb(53 53 53)';
        menuItem.style.filter = 'blur(1px)';
        menuItem.style.cursor = 'not-allowed';
    } else {
        menuItem.style.backgroundColor = '';
        menuItem.style.filter = '';
        menuItem.style.cursor = 'pointer';
    }

    // EVENT LISTENER FOR MENU BUTTONS AND BACKGROUND
    window.addEventListener('mouseup', handleSettingsMenuClick);
};

// FOR REMOVING ABOVE ACTIVE EVENT LISTENERS
const removeListeners = () => {
    picker.removeEventListener('gmpx-placechange', handleSearchClick);
    cardsContainer.removeEventListener('click', handleCardClick);
};

// EVENT LISTENER FOR HEADER BUTTONS
headerBtns.addEventListener('click', handleHeaderBtnClick);

// EVENT LISTENER FOR SETTINGS
settingsBtn.addEventListener('click', handleSettingsBtn);