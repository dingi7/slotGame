import { useEffect, useRef, useState } from 'react';

export default function useLongPress(callback = () => {}, ms = 300, onFailHandler: () => void) {
  const [startLongPress, setStartLongPress] = useState(false);
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackTriggeredRef = useRef(false);
  const failedTriggeredRef = useRef(false);

  useEffect(() => {
    if (startLongPress) {
      callbackTriggeredRef.current = false;
      failedTriggeredRef.current = false;
      timerIdRef.current = setTimeout(() => {
        callback();
        callbackTriggeredRef.current = true;
      }, ms);
    } else {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
        if (!callbackTriggeredRef.current && !failedTriggeredRef.current) {
          console.log('failed');
          onFailHandler();
          failedTriggeredRef.current = true;
        }
      }
    }

    return () => {
      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, [callback, ms, startLongPress, onFailHandler]);

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false),
  };
}
