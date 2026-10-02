import { useEffect, useRef, useCallback } from 'react';

/**
 * Returns a throttled version of the callback (leading + trailing edge),
 * supaya event terakhir dalam jendela throttle tidak pernah terlewat.
 * @param {Function} fn   - function to throttle
 * @param {number}   ms   - throttle interval in ms
 */
export const useThrottle = (fn, ms = 100) => {
  const lastCall = useRef(0);
  const timerRef = useRef(null);
  const fnRef = useRef(fn);

  // Selalu panggil fn terbaru tanpa perlu re-subscribe listener
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return useCallback(
    (...args) => {
      const now = Date.now();
      const remaining = ms - (now - lastCall.current);
      if (remaining <= 0) {
        lastCall.current = now;
        fnRef.current(...args);
      } else if (!timerRef.current) {
        // Jadwalkan panggilan trailing di akhir jendela throttle
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          lastCall.current = Date.now();
          fnRef.current(...args);
        }, remaining);
      }
    },
    [ms]
  );
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
