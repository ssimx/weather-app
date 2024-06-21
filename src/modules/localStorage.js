const setStorage = (key, value) => {
    console.log(key, value)
    localStorage.setItem(key, JSON.stringify(value));
};

const getStorage = (key) => JSON.parse(localStorage.getItem(key));

export { setStorage, getStorage };
