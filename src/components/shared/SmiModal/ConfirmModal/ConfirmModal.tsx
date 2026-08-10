'use client';
import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Dialog, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTransition from '@/components/shared/SmiModal/ModalTransition';
import TextStyle from '@/components/shared/TextStyle';
import VStack from '@/components/shared/VStack';

import type { ConfirmModalProps } from './ConfirmModal.types';

/**
 * ConfirmModal component is a part of the NiceModal library and displays a confirmation dialog.
 *
 * @component
 * @example
 * // Example of using the ConfirmModal component to show a confirmation dialog
 * NiceModal.show(MODAL.GLOBAL.CONFIRM, {
 *   title: 'Apakah Anda yakin ingin menghapus?',
 *   onSubmit: () => {
 *     // Handle submission logic
 *   },
 * });
 *
 * @param {Object} options - Options for configuring the ConfirmModal.
 * @param {string} [options.title='Apakah Anda yakin ingin menghapus?'] - The title of the confirmation dialog.
 * @param {Function} [options.onSubmit] - Callback function triggered when the user clicks the "Simpan" (Save) button.
 * @param {string} [options.cancelText='Batal'] - The wording for cancel button.
 * @param {string} [options.agreeText='Simpan'] - The wording for agree button.
 * @returns {JSX.Element} JSX.Element
 */

const ConfirmModal = NiceModal.create(({
  customProp = { icon: 'warning', text: 'Warning!!' },
  title = 'Apakah Anda yakin ingin menghapus?',
  onSubmit = () => {},
  onCancel = () => {},
  cancelText = 'Batal',
  agreeText = 'Simpan',
}: ConfirmModalProps) => {
  const theme = useTheme();

  const modalId = MODAL.GLOBAL.CONFIRM;
  const modal = useModal(modalId);

  const handleTitle = () => {
    if (typeof title === 'string') {
      return (
        <TextStyle sx={{ textAlign: 'center' }}>
          {title}
        </TextStyle>
      );
    } else {
      return title;
    }
  };
  return (
    <Dialog
      TransitionComponent={ModalTransition}
      open={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      PaperProps={{
        sx: {
          borderRadius: theme.radius(2),
          padding: theme.spacing(4),
          width: theme.spacing(58.75),
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
          <Icon
            iconName={customProp.icon}
            sx={{
              color: theme.palette.warning.main,
              fontSize: customProp?.size ? customProp?.size : theme.spacing(8.25),
            }}
          />
          <TextStyle
            variant="display2"
            color={customProp?.color ? customProp?.color : theme.palette.custom.lightYellow}
            weight={700}
            sx={{ textAlign: 'center' }}
          >
            {customProp.text}
          </TextStyle>

          {handleTitle()}
        </VStack>
        <RowWrapper
          sx={{
            gap: theme.spacing(2),
            justifyContent: 'center',
          }}
        >
          <Button
            variant="outlined"
            isFull
            onClick={() => {
              onCancel();
              closeNiceModal(modalId);
            }}
          >
            {cancelText}
          </Button>
          <Button
            variant="contained"
            isFull
            onClick={() => {
              onSubmit();
              closeNiceModal(modalId);
            }}
          >
            {agreeText}
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </Dialog>
  );
});

export default ConfirmModal;
