import { setStorage, getStorage } from './localStorage';

let savedLocations;

if (getStorage('savedLocations') === null) {
    savedLocations = [
        {
            city: 'Melbourne',
            latitude: -37.8136276,
            longitude: 144.9630576,
            locationId: 'ChIJ90260rVG1moRkM2MIXVWBAQ',
            sortIndex: 0,
        },
        {
            city: 'Los Angeles',
            latitude: 34.0549076,
            longitude: -118.242643,
            locationId: 'ChIJE9on3F3HwoAR9AhGJW_fL-I',
            sortIndex: 1,
        },
        {
            city: 'Ljubljana',
            latitude: 46.0569465,
            longitude: 14.5057515,
            locationId: 'ChIJ0YaYlvUxZUcRIOw_ghz4AAQ',
            sortIndex: 2,
        },
    ];

    setStorage('savedLocations', savedLocations);
} else {
    savedLocations = getStorage('savedLocations');
}

export default function locations() {
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
                city,
                latitude,
                longitude,
                locationId,
                sortIndex: savedLocations.length,
            },
        );
        return setStorage('savedLocations', savedLocations);
    };

    const remove = (locationIndex) => {
        savedLocations.splice(locationIndex, 1);

        savedLocations.forEach((location, index) => {
            const element = location;
            element.sortIndex = index;
        });

        return setStorage('savedLocations', savedLocations);
    };

    const sort = () => {
        savedLocations.sort((a, b) => a.sortIndex - b.sortIndex);
        return setStorage('savedLocations', savedLocations);
    };

    const get = () => getStorage('savedLocations');

    return {
        exists,
        add,
        remove,
        sort,
        get,
    };
}
