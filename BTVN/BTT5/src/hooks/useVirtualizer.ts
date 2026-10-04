import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface UseVirtualizerOptions {
  count: number;
  itemHeight: number;
  overscan?: number;
  getScrollElement: () => HTMLElement | null;
}

export interface VirtualItem {
  index: number;
  offsetTop: number;
  size: number;
}

export function useVirtualizer({
  count,
  itemHeight,
  overscan = 5,
  getScrollElement,
}: UseVirtualizerOptions) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(620);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const element = getScrollElement();
    if (!element) return;

    const updateMeasurements = () => {
      if (element.clientHeight && element.clientHeight !== containerHeight) {
        setContainerHeight(element.clientHeight);
      }
      setScrollTop(element.scrollTop);
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(() => {
        setScrollTop(element.scrollTop);
      });
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === element) {
          const newHeight = entry.contentRect.height || element.clientHeight || 620;
          setContainerHeight(newHeight);
        }
      }
    });

    element.addEventListener('scroll', handleScroll, { passive: true });
    resizeObserver.observe(element);
    updateMeasurements();

    return () => {
      element.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [getScrollElement, containerHeight]);

  const totalHeight = count * itemHeight;

  const { startIndex, endIndex, virtualItems } = useMemo(() => {
    if (count === 0) {
      return { startIndex: 0, endIndex: 0, virtualItems: [] };
    }

    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(count - 1, Math.floor(scrollTop / itemHeight) + visibleCount + overscan);

    const items: VirtualItem[] = [];
    for (let i = start; i <= end; i++) {
      items.push({
        index: i,
        offsetTop: i * itemHeight,
        size: itemHeight,
      });
    }

    return {
      startIndex: start,
      endIndex: end,
      virtualItems: items,
    };
  }, [count, itemHeight, overscan, scrollTop, containerHeight]);

  const scrollToIndex = useCallback(
    (index: number, align: 'start' | 'center' | 'end' = 'start') => {
      const element = getScrollElement();
      if (!element) return;

      let targetScrollTop = index * itemHeight;
      if (align === 'center') {
        targetScrollTop = index * itemHeight - containerHeight / 2 + itemHeight / 2;
      } else if (align === 'end') {
        targetScrollTop = (index + 1) * itemHeight - containerHeight;
      }

      element.scrollTo({
        top: Math.max(0, Math.min(targetScrollTop, totalHeight - containerHeight)),
        behavior: 'smooth',
      });
    },
    [getScrollElement, itemHeight, containerHeight, totalHeight]
  );

  return {
    virtualItems,
    totalHeight,
    startIndex,
    endIndex,
    scrollToIndex,
    scrollTop,
    containerHeight,
  };
}
