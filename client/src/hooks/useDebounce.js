import { useState, useEffect } from 'react';

/**
 * useDebounce – returns a debounced value that updates after the specified delay.
 * @param {any} value The raw value to debounce.
 * @param {number} [delay=300] Delay in milliseconds (default 300 ms).
 */
export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
