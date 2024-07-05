import { useEffect, useRef, useState } from "react";

export default function useLongPress(
  callback = () => {},
  ms = 300,
  onFailHandler: () => void,
  onShortClick: () => void
) {
  const [startLongPress, setStartLongPress] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackTriggeredRef = useRef(false);
  const failedTriggeredRef = useRef(false);

  const handleClickEnd = () => {
    const endTime = new Date();
    if (startTime) {
      const timeDifference = endTime.getTime() - startTime.getTime();
      if (timeDifference >= ms) {
        callback();
        callbackTriggeredRef.current = true;
      } else {
        onShortClick();
      }
    }
    setStartLongPress(false);
    setStartTime(null);
  };

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
    onMouseDown: () => {
      setStartLongPress(true);
      setStartTime(new Date());
    },
    onMouseUp: handleClickEnd,
    onMouseLeave: handleClickEnd,
    onTouchStart: () => {
      setStartLongPress(true);
      setStartTime(new Date());
    },
    onTouchEnd: handleClickEnd,
  };
}
