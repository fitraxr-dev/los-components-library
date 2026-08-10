'use client';
import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Dialog, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import ModalTransition from '@/components/shared/SmiModal/ModalTransition';
import TextStyle from '@/components/shared/TextStyle';
import VStack from '@/components/shared/VStack';

import type { SuccessModalProps } from './SuccessModal.types';

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

const SuccessModal = NiceModal.create(({
  title = 'Data berhasil disimpan',
  buttonText = 'Close',
  onClose = () => { },
}: SuccessModalProps) => {
  const theme = useTheme();

  const modalId = MODAL.GLOBAL.SUCCESS;
  const modal = useModal(modalId);

  return (
    <Dialog
      TransitionComponent={ModalTransition}
      open={modal.visible}
      onClose={() => {
        closeNiceModal(modalId);
        onClose();
        modal.resolve();
      }}
      PaperProps={{
        sx: {
          borderRadius: theme.radius(2),
          padding: theme.spacing(8),
          width: '24.5vw',
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
            iconName="success"
            sx={{
              color: theme.palette.success.main,
              fontSize: theme.spacing(12),
            }}
          />
          <TextStyle
            variant="display2"
            color={theme.palette.custom.softGreen}
            weight={700}
            sx={{ textAlign: 'center' }}
          >
            Success
          </TextStyle>

          <TextStyle sx={{ textAlign: 'center' }}>
            {title}
          </TextStyle>
        </VStack>

        <Button
          variant="outlined"
          isFull
          onClick={() => {
            closeNiceModal(modalId);
            onClose();
            modal.resolve();
          }}
        >
          {buttonText}
        </Button>
      </ColumnWrapper>
    </Dialog>
  );
});

export default SuccessModal;
