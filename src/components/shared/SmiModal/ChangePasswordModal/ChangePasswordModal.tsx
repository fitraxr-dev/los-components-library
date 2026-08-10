'use client';
import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Dialog, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';


import { ControlledInput } from '@/components/pages/Login/CreatePasswordPage/CreatePassword.page';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTransition from '@/components/shared/SmiModal/ModalTransition';

import Text from '../../Input/components/Text';
import Title from '../../Title';

import useChangePassword from './ChangePasswordModal.hook';

import type { ChangePasswordModalProps } from './ChangePasswordModal.types';


const ChangePasswordModal = NiceModal.create(({
  title = 'Ubah Password',
  onSuccess = () => {},
  onCancel = () => {},
  cancelText = 'Batal',
  agreeText = 'Simpan',
}: ChangePasswordModalProps) => {
  const theme = useTheme();
  const modalId = MODAL.CHANGE_PASSWORD;
  const modal = useModal(modalId);

  const {
    isPending,
    methods,
    onSubmit,
  } = useChangePassword({ modalId });

  methods.formState.errors;

  return (
    <Dialog
      TransitionComponent={ModalTransition}
      open={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      PaperProps={{
        sx: {
          borderRadius: theme.radius(2),
          padding: theme.spacing(4),
          width: theme.spacing(82),
        },
      }}
    >
      <ColumnWrapper >
        <RowWrapper sx={{ }} justifyContent="center" alignItems="center">
          <Title title="Ubah Password" />
        </RowWrapper>
        <ControlledInput
          control={methods.control}
          name="oldPassword"
          containerSx={{ marginTop: theme.spacing(4.5) }}
          autoComplete="old-password"
          type="password"
          label="Password Lama"
          placeholder="Password Lama"
          iconColor="black"
        />
        <ControlledInput
          control={methods.control}
          name="newPassword"
          containerSx={{ marginTop: theme.spacing(4.5) }}
          autoComplete="new-password"
          type="password"
          label="Password Baru"
          placeholder="Password Baru"
          iconColor="black"
        />
        <ColumnWrapper gap={1.5} sx={{ marginTop: theme.spacing(1.5) }}>
          <RowWrapper gap={1} >
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
          containerSx={{ marginTop: theme.spacing(3) }}
          autoComplete="new-password"
          type="password"
          label="Konfirmasi Password Baru"
          placeholder="Konfirmasi Password Baru"
          iconColor="black"
        />
        <RowWrapper
          sx={{
            gap: theme.spacing(2),
            justifyContent: 'center',
          }}
        >
          <Button
            id="cancel-button"
            variant="outlined"
            isFull
            onClick={() => {
              onCancel();
              closeNiceModal(modalId);
            }}
            sx={{
              '&': {
                marginTop: theme.spacing(3),
              },
            }}
          >
            {cancelText}
          </Button>
          <Button
            id="login-button"
            disabled={!methods.formState.isValid}
            isFull
            data-testid="login-button"
            isLoading={isPending}
            onClick={methods.handleSubmit(onSubmit)}
            sx={{
              '&': {
                marginTop: theme.spacing(3),
              },
            }}
          >
            Login
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </Dialog>
  );
});

export default ChangePasswordModal;
