import { useEffect, useRef, useCallback, type RefCallback } from 'react';

type RevealOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  visibleClass?: string;
};

export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
  once = true,
  visibleClass = 'visible',
}: RevealOptions = {}) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!('IntersectionObserver' in window)) {
      element.classList.add(visibleClass);
      return;
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
          if (once) observer.disconnect();
        }
      }
    }, { threshold, rootMargin });
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, visibleClass]);
  return ref;
}

export function useMultiIntersection<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '0px 0px -30px 0px',
  visibleClass = 'visible',
  staggerMs = 80,
}: Omit<RevealOptions, 'once'> & { staggerMs?: number } = {}) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const itemsRef = useRef(new Set<T>());
  const timersRef = useRef(new Map<Element, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const items = itemsRef.current;
    const timers = timersRef.current;
    if (!('IntersectionObserver' in window)) {
      items.forEach(element => element.classList.add(visibleClass));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (entry.target.classList.contains(visibleClass)) return;
        const index = Array.from(items).findIndex(element => element === entry.target);
        const timer = setTimeout(() => {
          timers.delete(entry.target);
          if (entry.target.isConnected) entry.target.classList.add(visibleClass);
        }, Math.max(0, index) * staggerMs);
        timers.set(entry.target, timer);
      });
    }, { threshold, rootMargin });
    observerRef.current = observer;
    items.forEach(element => observer.observe(element));
    return () => {
      observer.disconnect();
      observerRef.current = null;
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, [threshold, rootMargin, visibleClass, staggerMs]);

  const setRef: RefCallback<T> = useCallback((element: T | null) => {
    if (!element) return;
    itemsRef.current.add(element);
    if ('IntersectionObserver' in window) observerRef.current?.observe(element);
    else element.classList.add(visibleClass);
    return () => {
      observerRef.current?.unobserve(element);
      itemsRef.current.delete(element);
      const timer = timersRef.current.get(element);
      if (timer !== undefined) clearTimeout(timer);
      timersRef.current.delete(element);
    };
  }, [visibleClass]);
  return { setRef };
}
