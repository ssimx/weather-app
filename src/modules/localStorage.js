const setStorage = (savedLocations) => {
    localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
};

const getStorage = () => JSON.parse(localStorage.getItem('savedLocations'));

export { setStorage, getStorage };
