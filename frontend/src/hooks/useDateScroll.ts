import { useRef, useCallback } from "react";

const useDateScroll = () => {
  const tabRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const scrollToDate = useCallback((date: number) => {
    const tabEl = tabRef.current;
    const targetEl = itemRefs.current.get(date);
    if (tabEl && targetEl) {
      const scrollPos =
        targetEl.offsetLeft + targetEl.offsetWidth / 2 - tabEl.clientWidth / 2;
      tabEl.scrollTo({ left: scrollPos, behavior: "smooth" });
    }
  }, []);

  return { tabRef, itemRefs, scrollToDate };
};

export default useDateScroll;
