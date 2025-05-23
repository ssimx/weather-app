import { setStorage, getStorage } from './localStorage';

// Declare savedLocations but don't initialize it yet
let savedLocations;

export default function locations() {
// Initialize savedLocations only when the function is called
    if (!savedLocations) {
        if (getStorage('savedLocations') === null) {
            savedLocations = [
                {
                    city: 'Melbourne',
                    latitude: -37.8136276,
                    longitude: 144.9630576,
                    locationId: 'ChIJ90260rVG1moRkM2MIXVWBAQ',
                },
                {
                    city: 'Los Angeles',
                    latitude: 34.0549076,
                    longitude: -118.242643,
                    locationId: 'ChIJE9on3F3HwoAR9AhGJW_fL-I',
                },
                {
                    city: 'Ljubljana',
                    latitude: 46.0569465,
                    longitude: 14.5057515,
                    locationId: 'ChIJ0YaYlvUxZUcRIOw_ghz4AAQ',
                },
            ];

            setStorage('savedLocations', savedLocations);
        } else {
            savedLocations = getStorage('savedLocations');
        }
    }

    const exists = (locationId) => {
        if (savedLocations.length !== 0) {
            return !!savedLocations.filter((location) => location.locationId === locationId).length;
        }
        return false;
    };

    const add = (city, latitude, longitude, locationId) => {
        savedLocations.push({
            city,
            latitude,
            longitude,
            locationId,
        });
        return setStorage('savedLocations', savedLocations);
    };

    const remove = (locationIndex) => {
        savedLocations.splice(locationIndex, 1);
        return setStorage('savedLocations', savedLocations);
    };

    const get = () => getStorage('savedLocations');

    return {
        exists,
        add,
        remove,
        get,
    };
}
