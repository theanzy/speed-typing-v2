const addToList = (key, value) => {
    const storedValues = getList(key);
    storedValues.push(value);
    localStorage.setItem(key, JSON.stringify(storedValues));
}

const getList = (key) => {
    return JSON.parse(localStorage.getItem(key)) || [];
}
 
export { addToList, getList };
