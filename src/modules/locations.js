import { setStorage, getStorage } from './localStorage';

export default function locations() {
    let savedLocations = [
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
    if (getStorage() === null) {
        setStorage(savedLocations);
    } else {
        savedLocations = getStorage('savedLocations');
    }

    const exists = (locationId) => {
        if (savedLocations.length !== 0) {
            // eslint-disable-next-line max-len
            return !!(savedLocations.filter((location) => location.locationId === locationId).length);
        }
        return false;
    };

    const add = (city, latitude, longitude, locationId) => {
        savedLocations.push(
            {
                city, latitude, longitude, locationId,
            },
        );
        console.log(savedLocations);
        return setStorage(savedLocations);
    };

    const remove = (index) => {
        savedLocations.splice(index);
        return setStorage(savedLocations, 'savedLocations');
    };

    const get = () => getStorage();

    return { exists, add, remove, get };
};
