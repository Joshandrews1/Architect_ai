
'use client';

import { useState, useEffect, useRef, type RefObject } from 'react';

interface Options extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useInView<T extends HTMLElement>(options?: Options): [RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (options?.triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      options
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  // We only want to re-run the effect if the options change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, options?.root, options?.rootMargin, options?.threshold, options?.triggerOnce]);

  return [ref, inView];
}
