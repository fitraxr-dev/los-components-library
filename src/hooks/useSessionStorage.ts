import { useEffect, useState } from 'react';

/**
 * Custom React hook for managing state in session storage.
 *
 * This hook allows you to store and retrieve state in the browser's session storage.
 * It provides a way to persist and synchronize state across different components.
 *
 * @param {string} key - The key under which the value will be stored in session storage.
 * @param {*} initialValue - The initial value for the state.
 * @returns {[*, function]} An array containing the current state value and a function to update the state.
 *
 * @example
 * // Usage example
 * const [count, setCount] = useSessionStorage('count', 0);
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage
 *
 * @throws {Error} If the key parameter is not a string or if the initial value cannot be JSON-parsed.
 */
const useSessionStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = window.sessionStorage.getItem(key);
    if (storedValue)
      try {
        return JSON.parse(storedValue);
      } catch (error) {
        return initialValue;
      }
    else {
      return initialValue;
    }
  });

  useEffect(() => { // broken effect
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue] as const;
};

export default useSessionStorage;
