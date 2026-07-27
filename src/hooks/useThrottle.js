import { useEffect, useRef, useCallback } from 'react';

/**
 * Returns a throttled version of the callback.
 * @param {Function} fn   - function to throttle
 * @param {number}   ms   - throttle interval in ms
 */
export const useThrottle = (fn, ms = 100) => {
  const lastCall = useRef(0);

  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastCall.current >= ms) {
      lastCall.current = now;
      fn(...args);
    }
  }, [fn, ms]);
};

/**
 * Attaches a throttled scroll listener and cleans up on unmount.
 */
export const useScrollThrottle = (fn, ms = 100) => {
  const throttled = useThrottle(fn, ms);

  useEffect(() => {
    window.addEventListener('scroll', throttled, { passive: true });
    return () => window.removeEventListener('scroll', throttled);
  }, [throttled]);
};
