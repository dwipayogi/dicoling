import { useEffect, useRef, useState } from "react";

/**
 * Returns a debounced version of the given value.
 *
 * On the **first render** the value is returned immediately (no delay),
 * so the UI doesn't flash empty content while waiting for the timer.
 * Subsequent changes are debounced by `delayMs` milliseconds.
 */
export function useDebouncedValue<T>(value: T, delayMs = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip debouncing on first render — propagate initial value immediately
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handle = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => clearTimeout(handle);
  }, [value, delayMs]);

  return debouncedValue;
}
