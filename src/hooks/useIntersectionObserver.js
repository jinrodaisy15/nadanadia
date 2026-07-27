import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for IntersectionObserver-based scroll reveal.
 * @param {object} options
 * @param {number}  options.threshold  - 0 to 1
 * @param {string}  options.rootMargin - e.g. '0px 0px -50px 0px'
 * @param {boolean} options.once       - disconnect after first intersection
 * @param {string}  options.visibleClass - CSS class to add
 */
export const useIntersectionObserver = ({
  threshold = 0.15,
  rootMargin = '0px 0px -40px 0px',
  once = true,
  visibleClass = 'visible',
} = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      el.classList.add(visibleClass);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(visibleClass);
          if (once) observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, visibleClass]);

  return ref;
};

/**
 * Observe multiple elements at once (e.g. staggered gallery items).
 * Returns a callback ref setter.
 */
export const useMultiIntersection = ({
  threshold = 0.1,
  rootMargin = '0px 0px -30px 0px',
  visibleClass = 'visible',
  staggerMs = 80,
} = {}) => {
  const observerRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      itemsRef.current.forEach(el => el && el.classList.add(visibleClass));
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = itemsRef.current.indexOf(entry.target);
            setTimeout(() => {
              entry.target.classList.add(visibleClass);
            }, idx * staggerMs);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin }
    );

    itemsRef.current.forEach(el => el && observerRef.current.observe(el));

    return () => observerRef.current?.disconnect();
  }, [threshold, rootMargin, visibleClass, staggerMs]);

  const setRef = useCallback((el) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
      observerRef.current?.observe(el);
    }
  }, []);

  return { setRef };
};
