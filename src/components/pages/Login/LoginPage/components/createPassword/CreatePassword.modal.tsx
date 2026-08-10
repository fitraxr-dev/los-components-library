'use client';
import React, { useEffect, useRef, useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, Dialog, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';
import validateOtp from '@/services/api/auth/validateOtp';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTransition from '@/components/shared/SmiModal/ModalTransition';
import Title from '@/components/shared/Title';

import { ControlledInput } from '../../../CreatePasswordPage/CreatePassword.page';
import useGetOtpStatus from '../../hooks/useGetOtpStatus';
import useResendOtp from '../../hooks/useResendOtp';
import { MODAL } from '../../login.constants';

import useCreatePassword from './CreatePassword.hook';

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
  onClose?: () => void;
  onSuccess?: () => void;
}

export const CreatePasswordModal = NiceModal.create(({
  email = 'example@example.com',
  onClose = () => { },
  onSuccess = () => { },
}: OtpProps) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState<string[]>(Array.from({ length: 6 }));
  const isInputFilled = !input.includes(undefined) && !input.includes('');
  const refs = useRef<HTMLElement[]>(Array.from<HTMLElement>({ length: 6 }));
  const time = new Date();
  time.setSeconds(time.getSeconds() + 60 * 1);
  const { data, isPending: isGetOtpStatusLoading } = useGetOtpStatus();
  const { mutate, isPending: isResendPending } = useResendOtp();
  const modalId = MODAL.CHANGE_PASSWORD;
  const modal = useModal(modalId);
  const {
    methods,
  } = useCreatePassword();

  const handleSubmit = () => {
    setIsLoading(true);
    validateOtp({ otp: input.join('') }).then((res) => {

    }).finally(() => setIsLoading(false));
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
      <ColumnWrapper >
        <RowWrapper sx={{ }} justifyContent="center" alignItems="center">
          <Title title="Buat Password" />
        </RowWrapper>
        <ControlledInput
          control={methods.control}
          name="newPassword"
          containerSx={{ marginTop: theme.spacing(2) }}
          type="password"
          label="Password Baru"
          placeholder="Password Baru"
          iconColor="black"
        />
        <ColumnWrapper gap={2}>
          <RowWrapper gap={1} sx={{ marginTop: theme.spacing(2) }}>
            <Icon
              iconName="tick-circle"
              sx={{
                '& *': {
                  stroke:
                       !methods.getValues('newPassword') || methods.formState.errors.newPassword?.types?.min ?
                         theme.palette.custom.gray30 :
                         theme.palette.success.main,
                },
              }}
            />
            <Text
              labelProps={{ color:
                       !methods.getValues('newPassword') || methods.formState.errors.newPassword?.types.min ?
                         theme.palette.custom.gray30 :
                         theme.palette.success.main,
              }}
            >
              Terdiri dari 12 karakter atau lebih
            </Text>
          </RowWrapper>
          <RowWrapper gap={1}>
            <Icon
              iconName="tick-circle"
              sx={{
                '& *': {
                  stroke:
                       !methods.getValues('newPassword') || methods.formState.errors.newPassword?.types['lower-upper-case'] ?
                         theme.palette.custom.gray30 :
                         theme.palette.success.main,
                },
              }}
            />
            <Text
              labelProps={{ color:
                       !methods.getValues('newPassword') || methods.formState.errors.newPassword?.types['lower-upper-case'] ?
                         theme.palette.custom.gray30 :
                         theme.palette.success.main,
              }}
            >
              Mengandung huruf besar dan huruf kecil
            </Text>
          </RowWrapper>
          <RowWrapper gap={1}>
            <Icon
              iconName="tick-circle"

              sx={{
                '& *': {
                  stroke:
                       !methods.getValues('newPassword') || methods.formState.errors.newPassword?.types['number-symbol'] ?
                         theme.palette.custom.gray30 :
                         theme.palette.success.main,
                },
              }}
            />
            <Text
              labelProps={{ color:
                       !methods.getValues('newPassword') || methods.formState.errors.newPassword?.types['number-symbol'] ?
                         theme.palette.custom.gray30 :
                         theme.palette.success.main,
              }}
            >
              Mengandung paling tidak 1 angka atau 1 simbol
            </Text>
          </RowWrapper>
        </ColumnWrapper>
        <ControlledInput
          control={methods.control}
          name="newPasswordConfirm"
          containerSx={{ marginTop: theme.spacing(2) }}
          type="password"
          label="Konfirmasi Password Baru"
          placeholder="Konfirmasi Password Baru"
          iconColor="black"
        />
        <Button
          id="login-button"
          data-testid="login-button"
          //   isLoading={isLoading}
          onClick={() => {}}
          sx={{
            '&': {
              marginTop: theme.spacing(2),
            },
          }}
        >
          Login
        </Button>
      </ColumnWrapper>
    </Dialog>
  );
});
