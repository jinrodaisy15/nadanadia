import { useEffect, useRef, useCallback } from 'react';

/** Leading and trailing calls, using the most recent arguments and callback. */
export function useThrottle<Args extends unknown[]>(fn: (...args: Args) => void, ms = 100) {
  const lastCall = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestArgs = useRef<Args | null>(null);
  const fnRef = useRef(fn);

  useEffect(() => { fnRef.current = fn; }, [fn]);
  useEffect(() => () => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = null;
    latestArgs.current = null;
  }, [ms]);

  return useCallback((...args: Args) => {
    latestArgs.current = args;
    const remaining = ms - (Date.now() - lastCall.current);
    const invoke = () => {
      timerRef.current = null;
      lastCall.current = Date.now();
      const pending = latestArgs.current;
      latestArgs.current = null;
      if (pending) fnRef.current(...pending);
    };
    if (remaining <= 0) {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      invoke();
    } else if (timerRef.current === null) {
      timerRef.current = setTimeout(invoke, remaining);
    }
  }, [ms]);
}

export function useScrollThrottle(fn: () => void, ms = 100) {
  const throttled = useThrottle(fn, ms);
  useEffect(() => {
    window.addEventListener('scroll', throttled, { passive: true });
    return () => window.removeEventListener('scroll', throttled);
  }, [throttled]);
}
