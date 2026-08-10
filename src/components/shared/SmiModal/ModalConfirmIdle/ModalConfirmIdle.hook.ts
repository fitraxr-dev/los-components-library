import { useEffect, useState } from 'react';

import closeNiceModal from '@/hooks/useCloseNiceModal';
import useLogout from '@/hooks/useLogout';

import { MODAL_CHECK_IDLE, PROMPT_BEFORE_IDLE } from './ModalConfirmIdle.constants';

import type { ModalConfirmIdleProps } from './ModalConfirmIdle.types';


const useModalConfirmIdle = (props: ModalConfirmIdleProps) => {
  const { promptBeforeIdle = PROMPT_BEFORE_IDLE, handleStillHere } = props;
  const promptBeforeIdleInSeconds = promptBeforeIdle / 1000; // convert to seconds

  const modalId = MODAL_CHECK_IDLE;
  const { onLogout } = useLogout();

  const [counter, setCounter] = useState(Math.ceil(promptBeforeIdleInSeconds));

  useEffect(() => {
    if (counter <= 0) return;

    const intervalId = setInterval(() => {
      setCounter((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [counter]);

  const onClose = () => {
    handleStillHere();
    closeNiceModal(modalId);
  };

  const handleOnForceLogout = () => {
    onClose();
    onLogout();
  };

  return {
    counter,
    handleOnForceLogout,
    onClose,
  };
};

export default useModalConfirmIdle;
