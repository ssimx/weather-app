const setStorage = (savedLocations) => {
    localStorage.setItem('savedLocations', savedLocations);
};

const getStorage = () => {
    localStorage.getItem('savedLocations');
};

export { setStorage, getStorage };
