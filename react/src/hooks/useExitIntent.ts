import { useEffect, useEffectEvent } from 'react';

export const useExitIntent = (callback: () => void, enabled = true): void => {
  const onExit = useEffectEvent(callback);

  useEffect(() => {
    if (!enabled) return undefined;

    const onMouseOut = (event: MouseEvent) => {
      if (!event.relatedTarget && event.clientY <= 0) onExit();
    };

    document.addEventListener('mouseout', onMouseOut);
    return () => {
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, [enabled]);
};
