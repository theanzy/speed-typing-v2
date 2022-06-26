import { useCallback, useState } from 'react';

function useDarkMode() {
  const initialDarkMode = getLocalStorage('DARK_MODE', false);
  const [darkMode, setDarkMode] = useState(initialDarkMode);
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      setLocalStorage('DARK_MODE', !prev);
      return !prev;
    });
  }, []);
  return { darkMode, toggleDarkMode };
}

function getLocalStorage(key, defaultValue) {
  let item = localStorage.getItem(key);
  if (item == null) {
    item = defaultValue;
  }
  return item;
}

function setLocalStorage(key, value) {
  return localStorage.setItem(key, value);
}

export default useDarkMode;
