// useStableInterval.ts (TypeScript version)
import { useEffect, useRef } from "react";

/**
 * Repeatedly calls `callback` on a fixed interval of `delay` ms.
 * If `callback` changes, the latest version is used on the next tick.
 */
export function useStableInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback);

  // Update ref each render so interval callback uses the latest version
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null || delay === undefined) return;

    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);

    return () => {
      clearInterval(id);
    };
  }, [delay]);
}
