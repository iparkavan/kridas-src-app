import { useEffect } from "react";

const useIntersectionObserver = ({ target, onIntersect, enabled = true }) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      {
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    const el = target && target.current;
    if (!el) {
      return;
    }

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [enabled, onIntersect, target]);
};

export { useIntersectionObserver };
