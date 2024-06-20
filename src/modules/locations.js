import { setStorage, getStorage } from './localStorage';

export default function locations() {
    let savedLocations = [
        {
            city: 'Melbourne',
            latitude: -37.8136276,
            longitude: 144.9630576,
        },
        {
            city: 'Los Angeles',
            latitude: 34.0549076,
            longitude: -118.242643,
        },
        {
            city: 'Ljubljana',
            latitude: 46.0569465,
            longitude: 14.5057515,
        },
    ];
    if (getStorage() === null) {
        setStorage(savedLocations);
    } else {
        savedLocations = getStorage('savedLocations');
    }

    const add = (city, latitude, longitude) => {
        savedLocations.push({ city, latitude, longitude });
        return setStorage(savedLocations);
    };

    const remove = (index) => {
        savedLocations.splice(index);
        return setStorage(savedLocations, 'savedLocations');
    };

    const get = () => getStorage();

    return { add, remove, get };
};
