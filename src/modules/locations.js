import { setStorage, getStorage } from './localStorage';

export default function locations() {
    let savedLocations = ['Los Angeles', 'London', 'Melbourne'];
    if (getStorage() === null) {
        setStorage(savedLocations);
    } else {
        savedLocations = getStorage('savedLocations');
    }

    const add = (cityName) => {
        savedLocations.push(cityName);
        return setStorage(savedLocations);
    };

    const remove = (index) => {
        savedLocations.splice(index);
        return setStorage(savedLocations, 'savedLocations');
    };

    const get = () => getStorage();

    return { add, remove, get };
};
