'use client';
import { useEffect, useState } from 'react';

import { useIdleTimer as _useIdleTimer } from 'react-idle-timer';


const useIdleTimer = () => {
  const [state, setState] = useState<string>('Active');
  const [count, setCount] = useState<number>(0);
  const [remaining, setRemaining] = useState<number>(0);

  const onIdle = () => {
    setState('Idle');
    alert('is idle');
  };

  const onActive = () => {
    setState('Active');
  };

  const onAction = () => {
    setCount(count + 1);
  };

  const { getRemainingTime } = _useIdleTimer({
    onAction,
    onActive,
    onIdle,
    throttle: 500,
    timeout: 600_000,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });
};

export default useIdleTimer;
