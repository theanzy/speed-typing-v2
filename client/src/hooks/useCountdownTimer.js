import { useState, useEffect, useRef, useCallback } from 'react';

const getTime = (timeDiff) => {
  // calculate time left
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  minutes = Math.max(minutes, 0);
  let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  seconds = Math.max(seconds, 0);
  return { days, hours, minutes, seconds };
};

function timeFromNow(time) {
  const futureTime = new Date().getTime() + toMs(time);
  return futureTime;
}

function toMs({ days, hours, minutes, seconds }) {
  let result = 0;
  if (!isNaN(days)) {
    result += days * 24 * 60 * 60 * 1000;
  }
  if (!isNaN(hours)) {
    result += hours * 60 * 60 * 1000;
  }
  if (!isNaN(minutes)) {
    result += minutes * 60 * 1000;
  }
  if (!isNaN(seconds)) {
    result += seconds * 1000;
  }
  return result;
}

function useCountdownTimer({ days, hours, minutes, seconds }) {
  const [futureTime, setFutureTime] = useState();
  const [remainingTime, setRemainingTime] = useState(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const intervalRef = useRef(null);

  const defaultMs = toMs({ days, hours, minutes, seconds });
  useEffect(() => {
    if (timerStarted) {
      setFutureTime(timeFromNow({ days, hours, minutes, seconds }));
    } else {
      clearInterval(intervalRef.current);
    }
  }, [timerStarted, days, hours, minutes, seconds]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemainingTime(futureTime - new Date().getTime());
    }, 500);
    return () => clearInterval(intervalRef.current);
  }, [futureTime]);

  useEffect(() => {
    if (remainingTime <= 0) {
      clearInterval(intervalRef.current);
      setTimerStarted(false);
    }
  }, [remainingTime]);

  const startTimer = useCallback(() => {
    setTimerStarted(true);
  }, []);
  const stopTimer = useCallback(() => {
    setTimerStarted(false);
  }, []);
  const restoreDefaultTime = useCallback(() => {
    setRemainingTime(null);
  }, []);
  return {
    timerStarted,
    startTimer,
    stopTimer,
    restoreDefaultTime,
    ...getTime(remainingTime == null ? defaultMs : remainingTime),
  };
}
export default useCountdownTimer;
