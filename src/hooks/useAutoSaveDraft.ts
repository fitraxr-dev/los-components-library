import { useEffect, useRef, useState } from 'react';

import { ActivityType } from '@/enums/Activity';
import { API } from '@/helpers/api';

import useRecordLog from './useRecordLog';


interface UseAutoSaveDraftProps {
  config?: any;
  isActive?: boolean;
  onSuccess?: (response: any) => void;
  payload?: any | (() => Promise<any>);
  timer?: number;
  url: string;
}

const DEFAULT_TIMER_MINUTE = 20;
const DEFAULT_TIMER = DEFAULT_TIMER_MINUTE * 60 * 1000;

const getAutoSaveTimerFromStorage = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_TIMER;
  }

  const minuteFromStorage = localStorage.getItem('autosave_minute');
  const minute = Number(minuteFromStorage);

  if (!minuteFromStorage || isNaN(minute) || minute <= 0) {
    return DEFAULT_TIMER;
  }

  return minute * 60 * 1000;
};

const useAutoSaveDraft = ({
  config,
  isActive = false,
  onSuccess,
  payload,
  timer,
  url,
}: UseAutoSaveDraftProps) => {
  const [isFetching, setIsFetching] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { recordActivity } = useRecordLog();
  const [payloadBefore, setPayloadBefore] = useState({});

  const resolvedTimer = timer ?? getAutoSaveTimerFromStorage();

  useEffect(() => {
    console.log('[useAutoSaveDraft] init', {
      date: new Date(),
      isActive,
      resolvedTimer,
      url,
    });

    if (!isActive || !url) {
      return;
    }

    const fetchData = async () => {
      try {
        console.log('[useAutoSaveDraft] hit api', {
          dateTime: new Date(),
          url,
        });

        setIsFetching(true);

        const payloadData =
          typeof payload === 'function' ? await payload() : payload;

        const response = await API(url, {
          data: payloadData,
          ...config,
        });

        onSuccess?.(response.data);
        recordActivity({
          activity: ActivityType.AUTO_SAVE,
          changeAfter: `${JSON.stringify(payloadData)}`,
          changeBefore: `${JSON.stringify(payloadBefore)}`,
        });
        setPayloadBefore(payloadData);
      } catch (error) {
        console.error('[useAutoSaveDraft] error', { error, url });
      } finally {
        setIsFetching(false);
      }
    };

    intervalRef.current = setInterval(fetchData, resolvedTimer);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, url, resolvedTimer, payload, config, onSuccess]);

  return {
    isFetching,
  };
};

export default useAutoSaveDraft;
