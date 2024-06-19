import { setStorage, getStorage } from './localStorage';

export default function locations() {
    let savedLocations;
    if (getStorage('savedLocations') === false) {
        savedLocations = [];
    } else {
        savedLocations = getStorage('savedLocations');
    }

    const add = (cityName) => {
        savedLocations.push(cityName);
        return setStorage(savedLocations, 'savedLocations');
    };

    const remove = (index) => {
        savedLocations.splice(index);
        return setStorage(savedLocations, 'savedLocations');
    };

    const get = () => getStorage();

    return { add, remove, get };
};
