import { useState, useEffect, useRef, useCallback } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import axios from 'axios';
import { useIdleTimer } from 'react-idle-timer';

import {
  IDLE_TIMEOUT,
  MODAL_CHECK_IDLE,
  PROMPT_BEFORE_IDLE,
} from '@/components/shared/SmiModal/ModalConfirmIdle/ModalConfirmIdle.constants';

import closeNiceModal from './useCloseNiceModal';
import useLogout from './useLogout';


const logOnLogout = 'IT99999'; //[IDLE TIMER] ⛔ Timer IDLE - Logout akan dipanggil
const logOnActive = 'IT00000'; //[IDLE TIMER] ✅ Timer ACTIVE - User sedang aktif
const logOnPrompt = 'IT00001'; //[IDLE TIMER] ⚠️ Timer PROMPT - Warning modal akan muncul
const logOnStillHere = 'IT00002'; //[IDLE TIMER] 🔄 Timer RESET - User klik "Lanjutkan"
const logOnPageVisible = 'IT00003'; //[IDLE TIMER] 👁️ Page VISIBLE - Wake up detected
const logOnPageHidden = 'IT00004'; //[IDLE TIMER] 👁️‍🗨️ Page HIDDEN - Sleep/tab switch detected
const logOnFocus = 'IT00005'; //[IDLE TIMER] 👁️‍🗨️ Page HIDDEN - Sleep/tab switch detected
const logOnError = 'IT00006'; //[IDLE TIMER] Error checking idle state:
const logOnMultipart = 'IT00007'; //[IDLE TIMER] ⏸️ Timer PAUSED - File upload detected
const logOnResume = 'IT00008'; //[IDLE TIMER] ▶️ Timer RESUMED - File upload completed
const logOnErrorResume = 'IT00009'; //[IDLE TIMER] ▶️ Timer RESUMED - File upload error (resume anyway)
const logOnAction = 'IT00010'; //[IDLE TIMER] 🎯 User ACTION detected - Timer akan reset

export function useTrackActivity(timeout = IDLE_TIMEOUT, promptBeforeIdle = PROMPT_BEFORE_IDLE) {
  const { onLogout } = useLogout();

  const [state, setState] = useState('Active');
  const [remaining, setRemaining] = useState(timeout);
  const lastHiddenTimeRef = useRef<number | null>(null);
  const lastActiveTimeRef = useRef<number>(Date.now());
  const onLogoutRef = useRef(onLogout);
  const isPausedRef = useRef<boolean>(false);

  // Update onLogoutRef setiap kali onLogout berubah
  useEffect(() => {
    onLogoutRef.current = onLogout;
  }, [onLogout]);

  const onIdle = useCallback(() => {
    // onIdle hanya dipanggil oleh react-idle-timer saat benar-benar idle
    // (tidak ada aktivitas selama timeout period)
    // Jadi tidak perlu check lagi, langsung logout
    const idleTime = new Date().toISOString();
    const timeSinceLastActive = Date.now() - lastActiveTimeRef.current;
    console.log(logOnLogout, {
      timeSinceLastActive: `${Math.floor(timeSinceLastActive / 1000)}s`,
      timeout: `${Math.floor(timeout / 1000)}s`,
      timestamp: idleTime,
    });

    setState('Idle');
    closeNiceModal(MODAL_CHECK_IDLE);
    onLogoutRef.current();
  }, [timeout]);

  const onActive = useCallback(() => {
    const activeTime = new Date().toISOString();
    console.log(logOnActive, {
      timestamp: activeTime,
    });

    setState('Active');
    lastActiveTimeRef.current = Date.now();
  }, []);

  const onAction = useCallback(() => {
    // onAction dipanggil setiap kali ada aktivitas user
    // Pastikan timer reset dan update lastActiveTime
    console.log(logOnAction, {
      timestamp: new Date().toISOString(),
    });
    lastActiveTimeRef.current = Date.now();
  }, []);

  // handleStillHere perlu didefinisikan sebelum onPrompt
  const handleStillHereRef = useRef<(() => void) | null>(null);

  const onPrompt = useCallback(() => {
    const promptTime = new Date().toISOString();
    console.log(logOnPrompt, {
      promptBeforeIdle: `${Math.floor(promptBeforeIdle / 1000)}s`,
      timestamp: promptTime,
    });

    setState('Prompted');
    const handleStillHere = handleStillHereRef.current;
    if (handleStillHere) {
      NiceModal.show(MODAL_CHECK_IDLE, { handleStillHere, promptBeforeIdle });
    }
  }, [promptBeforeIdle]);

  const { getRemainingTime, pause, reset, resume, isIdle } = useIdleTimer({
    crossTab: true,


    // Debounce untuk mencegah terlalu banyak reset
    debounce: 500,


    // Events yang akan di-detect untuk reset timer
    // Default events: mousemove, mousedown, keydown, touchstart, click, scroll, wheel
    // Pastikan semua aktivitas user terdeteksi
    events: [
      'mousedown',
      'mousemove',
      'keypress',
      'keydown',
      'DOMMouseScroll',
      'mousewheel',
      'mousemove',
      'pointermove',
      'touchstart',
      'touchmove',
      'MSPointerMove',
      'visibilitychange',
      'focus',
      'blur',
      'click',
      'scroll',
      'wheel',
    ],


    name: 'idle-auto-logout',


    onAction,


    onActive,


    onIdle,


    onPrompt,


    promptBeforeIdle,


    startOnMount: true,


    syncTimers: 0,

    timeout,
  });

  // Update remaining time dengan dependency yang benar
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const remainingTime = getRemainingTime();
        if (remainingTime !== null && remainingTime !== undefined) {
          setRemaining(Math.ceil(remainingTime / 1000));
        }
      } catch (error) {
        // Handle error jika timer belum initialized
        console.warn('Idle timer not ready:', error);
      }
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, [getRemainingTime]);

  const handleStillHere = useCallback(() => {
    const stillHereTime = new Date().toISOString();
    console.log(logOnStillHere, {
      timestamp: stillHereTime,
    });

    reset();
    lastActiveTimeRef.current = Date.now();
  }, [reset]);

  // Update ref setiap kali handleStillHere berubah
  useEffect(() => {
    handleStillHereRef.current = handleStillHere;
  }, [handleStillHere]);

  useEffect(() => {
    const requestId = axios.interceptors.request.use(function (config) {
      // Pause timer saat upload multipart untuk mencegah logout saat upload
      const isMultipart = config.headers?.['Content-Type'] === 'multipart/form-data' ||
                          config.data instanceof FormData;

      if (isMultipart) {
        if (!isPausedRef.current) {
          console.log(logOnMultipart, {
            timestamp: new Date().toISOString(),
            url: config.url || 'N/A',
          });
          pause();
          isPausedRef.current = true;
        }
      }
      return config;
    }, function (error) {
      return Promise.reject(error);
    });

    const responseId = axios.interceptors.response.use(function (res) {
      // Resume timer setelah response (termasuk setelah upload selesai)
      if (isPausedRef.current) {
        console.log(logOnResume, {
          timestamp: new Date().toISOString(),
          url: res.config?.url || 'N/A',
        });
        resume();
        isPausedRef.current = false;
      }
      return res;
    }, function (error) {
      // Resume timer meskipun error
      if (isPausedRef.current) {
        console.log(logOnErrorResume, {
          timestamp: new Date().toISOString(),
        });
        resume();
        isPausedRef.current = false;
      }
      return Promise.reject(error);
    });

    return () => {
      axios.interceptors.request.eject(requestId);
      axios.interceptors.response.eject(responseId);
    };
  }, [pause, resume]);

  // Handle sleep/wake detection using Page Visibility API
  useEffect(() => {
    const handlePageVisible = () => {
      if (lastHiddenTimeRef.current === null) return;

      const wakeTime = Date.now();
      const sleepDuration = wakeTime - lastHiddenTimeRef.current;
      const timeSinceLastActive = wakeTime - lastActiveTimeRef.current;
      const isLikelyTabSwitch = sleepDuration < 1000;

      console.log(logOnPageVisible, {
        isLikelyTabSwitch,
        sleepDuration: `${Math.floor(sleepDuration / 1000)}s`,
        timeSinceLastActive: `${Math.floor(timeSinceLastActive / 1000)}s`,
        timestamp: new Date().toISOString(),
      });

      // PENTING: Cek apakah aplikasi benar-benar idle sebelum logout
      // Jangan logout jika user sedang aktif menggunakan aplikasi
      try {
        const remainingTime = getRemainingTime();
        const isCurrentlyIdle = isIdle();

        console.log(logOnFocus, {
          isCurrentlyIdle,
          remainingTime: remainingTime ? `${Math.floor(remainingTime / 1000)}s` : 'N/A',
          timestamp: new Date().toISOString(),
        });

        // Jika tidak idle atau masih ada remaining time yang signifikan,
        // berarti user sedang aktif menggunakan aplikasi sebelum sleep
        if (!isCurrentlyIdle && remainingTime > promptBeforeIdle) {
          console.log(logOnActive, {
            timestamp: new Date().toISOString(),
          });
          reset();
          lastActiveTimeRef.current = wakeTime;
          lastHiddenTimeRef.current = null;
          return;
        }
      } catch (error) {
        console.warn(logOnError, {
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }

      // Hanya logout jika benar-benar idle dan waktu sudah melebihi threshold
      if (timeSinceLastActive >= timeout) {
        console.log(logOnLogout, {
          timeSinceLastActive: `${Math.floor(timeSinceLastActive / 1000)}s`,
          timeout: `${Math.floor(timeout / 1000)}s`,
          timestamp: new Date().toISOString(),
        });
        closeNiceModal(MODAL_CHECK_IDLE);
        onLogoutRef.current();
        return;
      }

      // Jika durasi sleep melebihi timeout (bukan tab switch), logout
      if (!isLikelyTabSwitch && sleepDuration >= timeout) {
        console.log(logOnLogout, {
          sleepDuration: `${Math.floor(sleepDuration / 1000)}s`,
          timeout: `${Math.floor(timeout / 1000)}s`,
          timestamp: new Date().toISOString(),
        });
        closeNiceModal(MODAL_CHECK_IDLE);
        onLogoutRef.current();
        return;
      }

      // Reset timer setelah wake up (kecuali tab switch singkat)
      if (!isLikelyTabSwitch) {
        console.log(logOnStillHere, {
          timestamp: new Date().toISOString(),
        });
        reset();
        lastActiveTimeRef.current = wakeTime;
      }
      lastHiddenTimeRef.current = null;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page menjadi hidden (sleep, tab switch, minimize)
        console.log(logOnPageHidden, {
          timestamp: new Date().toISOString(),
        });
        lastHiddenTimeRef.current = Date.now();
      } else {
        // Page menjadi visible lagi (wake up, tab focus, restore)
        handlePageVisible();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle focus sebagai backup detection untuk kasus tertentu
    const handleFocus = () => {
      if (!document.hidden && lastHiddenTimeRef.current !== null) {
        handleVisibilityChange();
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [timeout, reset, getRemainingTime, isIdle, promptBeforeIdle]);

  return { pause, remaining, reset, state };
}
