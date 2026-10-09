import { useEffect, useEffectEvent } from 'react';

export const useDelayedTrigger = (callback: () => void, delayMs: number): void => {
  const onTrigger = useEffectEvent(callback);

  useEffect(() => {
    const id = window.setTimeout(() => {
      onTrigger();
    }, delayMs);
    return () => {
      window.clearTimeout(id);
    };
  }, [delayMs]);
};
