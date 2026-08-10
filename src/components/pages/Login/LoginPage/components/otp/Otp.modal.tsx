'use client';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, Dialog, useTheme } from '@mui/material';
import { useTimer } from 'react-timer-hook';

import closeNiceModal from '@/hooks/useCloseNiceModal';
import validateOtp from '@/services/api/auth/validateOtp';
import { OtpRequestDto } from '@/services/openapi/auth-service';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Number from '@/components/shared/Input/components/Number';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTransition from '@/components/shared/SmiModal/ModalTransition';
import TextStyle from '@/components/shared/TextStyle';
import VStack from '@/components/shared/VStack';

import useGetOtpStatus from '../../hooks/useGetOtpStatus';
import useResendOtp from '../../hooks/useResendOtp';
import { MODAL } from '../../login.constants';

import type { OtpResponseDto } from '@/services/openapi/auth-service';

/**
 * SuccessModal component is a part of the NiceModal library and displays a success message in a modal.
 *
 * @component
 * @example
 * // Example of using the SuccessModal component to show a success message
 * NiceModal.show(MODAL.GLOBAL.SUCCESS, {
 *   title: 'Apakah Anda yakin ingin menghapus?',
 * });
 *
 * @param {Object} options - Options for configuring the SuccessModal.
 * @param {string} [options.title='Apakah Anda yakin ingin menghapus?'] - The title of the success modal.
 * @returns {JSX.Element} JSX.Element
 */

export type OtpProps = {
  email: string;
  token: string;
  onClose?: () => void;
  onSuccess?: (res: OtpResponseDto) => void;
}

export const OtpModal = NiceModal.create(({
  email = 'example@example.com',
  token,
  onClose = () => { },
  onSuccess = (res) => { },
}: OtpProps) => {
  const modalId = MODAL.OTP;
  const modal = useModal(modalId);
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState<string[]>(Array.from({ length: 6 }));
  const [locked, setLocked] = useState<boolean>(false);
  const [lockedDate, setLockedDate] = useState<Date | null>(null);
  const [errorCode, setErrorCode] = useState<string>('');
  const [canResetOtp, setCanResetOtp] = useState<boolean>(false);
  const [attempt, setAttempt] = useState<number[]>([0, 0, 0]);// total, failed, max
  const isInputFilled = !input.includes(undefined) && !input.includes('');
  const refs = useRef<HTMLElement[]>(Array.from<HTMLElement>({ length: 6 }));
  const { data, isPending: isGetOtpStatusLoading, isStale, isSuccess } = useGetOtpStatus({ token });
  const { mutate, isPending: isResendPending } = useResendOtp({
    onError: () => {

    },
    onSuccess: () => {
      setCanResetOtp(false);
    },
    token,
  },
  );
  const getTimer = (seconds: number) => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + seconds);
    return date;
  };
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({ autoStart: false, expiryTimestamp: getTimer(60), onExpire: () => setCanResetOtp(true) });
  const secondsDigit = seconds >= 10 ? seconds : `0${seconds}`;

  useMemo(() => {
    if (isSuccess) {
      restart(getTimer(60));
    }
    if (data) {
      setAttempt([data.totalAttempts, data.failedAttempts, data.maxAttempts]);
      if (data.maxAttempts !== 0 && data.failedAttempts >= data.maxAttempts) {
        setLocked(true);
        setLockedDate(new Date(data.lockedDate));
      }
    }
  }, [data]);


  const showErrorMessage = (errorCode) => {
    if (errorCode === '0421') {
      return `OTP tidak sesuai. Anda memiliki ${attempt[2] - attempt[1]} kesempatan lagi.`;
    }
    if (errorCode === '0422') {
      let diff = new Date(lockedDate).getTime() - new Date().getTime();
      return `OTP tidak sesuai. Tunggu ${diff} menit untuk kirim ulang.`;
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    validateOtp({ otp: input.join(''), token: token }).then((res) => {
      if (res) {
        onSuccess(res.data);
        closeNiceModal(modalId).then(() => {
          onClose();
        });
        modal.resolve();
      };
    })
      .catch((error) => {
        setErrorCode(error.errorCode);
      })
      .finally(() => setIsLoading(false));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    if (/^[0-9]{6}$/.test(paste)) {
      const pasteArr = paste.split('');
      const nextArr = input.map((val, idx) => {
        return pasteArr[idx] || val;
      });
      let idx = 0;
      for (const ref of refs.current) {
        (ref as HTMLInputElement).value = nextArr[idx];
        idx++;
      };
      setInput(nextArr);
    };
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>, idx: number) => {
    const isNumber = /^[0-9]+$/.test(event.key);
    if (isNumber || event.key === 'Backspace') {
      const nextArr = input.map((val2, idx2) => {
        if (idx === idx2) {
          return event.key === 'Backspace' ? '' : event.key;
        } else {
          return val2;
        }
      }
      );
      setInput(nextArr);
    }
    if (isNumber && idx !== input.length - 1) {
      refs.current[idx + 1].focus();
    }
    if (event.key === 'Backspace' && idx !== 0) {
      refs.current[idx - 1].focus();
    }
  };

  return (
    <Dialog
      TransitionComponent={ModalTransition}
      open={modal.visible}
      onClose={() => {
        closeNiceModal(modalId).then(() => {
          onClose();
        });
        modal.resolve();
      }}
      PaperProps={{
        sx: {
          borderRadius: theme.radius(2),
          padding: theme.spacing(8),
          width: '26.0vw',
        },
      }}
    >
      <ColumnWrapper
        sx={{
          gap: theme.spacing(4),
          justifyContent: 'space-between',
        }}
      >
        <VStack style={{ gap: theme.spacing(2) }} align="center">
          <TextStyle
            variant="display2"
            color={theme.palette.primary.main}
            weight={700}
            sx={{ textAlign: 'center' }}
          >
            Verifikasi OTP
          </TextStyle>

          <TextStyle sx={{ textAlign: 'center' }}>
            Masukan kode yang telah dikirimkan melalui Email {email}
          </TextStyle>
        </VStack>

        <RowWrapper gap={1}>
          {input.map((val, idx) => {
            return (
              <Number
                id={`input${idx}`}
                key={`input${idx}`}
                onPaste={handlePaste}
                getInputRef={(el) => (refs.current[idx] = el)}
                variant="standard"
                inputProps={{ style: { textAlign: 'center' } }}
                containerSx={{ '& *::before': { borderBottom: `2px solid ${theme.palette.custom.text} !important` } }}
                placeholder=" "

                value={val}
                onKeyUp={(e) => handleKeyUp(e, idx)}
              />
            );
          })}
        </RowWrapper>

        <VStack style={{ gap: theme.spacing(2) }} align="center">
          {
            errorCode !== '' &&
            <RowWrapper justifyContent="center" alignItems="center" padding={theme.spacing(1.5)} borderRadius="6px" sx={{ backgroundColor: theme.palette.errorOtp.main }}>
              <Icon
                iconName="close-circle"
                sx={{
                  marginRight: theme.spacing(0.8),
                  path: {
                    stroke: theme.palette.errorOtp.contrastText,
                  },
                }}
              />
              <TextStyle
                variant="body7"
                color={theme.palette.errorOtp.contrastText}
                weight={400}
                sx={{ textAlign: 'center' }}
              >
                {showErrorMessage(errorCode)}
              </TextStyle>
            </RowWrapper>
          }

          {/* TODO: Bikin context?*/}
          <TextStyle
            variant="body7"
            color={theme.palette.custom.gray20}
            weight={400}
            sx={{ textAlign: 'center' }}
          >
            Belum menerima kode? {canResetOtp ?
              <b
                style={{ cursor: 'pointer' }}
                onClick={() => mutate()}
              >Kirim ulang
              </b> :
              <b>Kirim ulang dalam {`${minutes}:${secondsDigit}`}</b>}
          </TextStyle>

          {attempt[2] !== 0 &&
          <TextStyle
            variant="body7"
            color={theme.palette.custom.gray20}
            weight={400}
            sx={{ textAlign: 'center' }}
          >
            Anda mempunyai kesempatan Kirim Ulang sebanyak <b>{`${attempt[2] - attempt[1]}/${attempt[2]}`}</b>
          </TextStyle>
          }
        </VStack>

        <Button
          isFull
          color="primary"
          isLoading={isLoading}
          disabled={locked || !isInputFilled}
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit
        </Button>
      </ColumnWrapper>
    </Dialog>
  );
});
