
import { useState, useCallback } from 'react';

/**
 * Like useState, but persisted in localStorage.
 * @param {string} key - localStorage key
 * @param {*} initialValue - default value if key not found
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (err) {
      console.warn(`useLocalStorage: error reading key "${key}"`, err);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function for the same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (err) {
        console.warn(`useLocalStorage: error writing key "${key}"`, err);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (err) {
      console.warn(`useLocalStorage: error removing key "${key}"`, err);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}