const addToList = (key, value, max=10) => {
    const storedValues = getList(key);
    const limitedValues = max > 0 ? storedValues.slice(Math.max(storedValues.length - max + 1, 0)) : storedValues;
    limitedValues.push(value);
    localStorage.setItem(key, JSON.stringify(limitedValues));
}

const getList = (key) => {
    return JSON.parse(localStorage.getItem(key)) || [];
}

const getValues = (arr, key) => {
    const result = []
    for (let i = 0; i < arr.length; i++) {
        result.push(arr[i][key])      
    }
    return result;
}

export { addToList, getList, getValues };
