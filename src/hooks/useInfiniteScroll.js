'use client';

import { useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = (callback, options = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    enabled = true
  } = options;

  const observerTarget = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
        }
      },
      { threshold, rootMargin }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [callback, threshold, rootMargin, enabled]);

  return observerTarget;
};
