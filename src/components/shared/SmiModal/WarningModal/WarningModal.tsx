'use client';
import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Dialog, useTheme } from '@mui/material';
import parse from 'html-react-parser';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTransition from '@/components/shared/SmiModal/ModalTransition';
import TextStyle from '@/components/shared/TextStyle';
import VStack from '@/components/shared/VStack';

import type { WarningModalProps } from './WarningModal.types';

/**
 * ConfirmModal component is a part of the NiceModal library and displays a confirmation dialog.
 *
 * @component
 * @example
 * // Example of using the ConfirmModal component to show a confirmation dialog
 * NiceModal.show(MODAL.GLOBAL.WARNING, {
 *   title: 'Apakah Anda yakin ingin menghapus?',
 *   onSubmit: () => {
 *     // Handle submission logic
 *   },
 * });
 *
 * @param {Object} options - Options for configuring the WarningModal.
 * @param {string} [options.title='Apakah Anda yakin ingin menghapus?'] - Warning!.
 * @param {Function} [options.onClose] - Callback function triggered when the user clicks the "Simpan" (Save) button.
 * @param {string} [options.closeText='Close'] - The wording for cancel button.
 * @param {boolean} [options.parseHtml=false] - Whether to parse HTML content in title.
 * @param {string} [options.textAlign='center'] - Text alignment for title ('left', 'center', 'right').
 * @returns {JSX.Element} JSX.Element
 */

const WarningModal = NiceModal.create(({
  title = 'Warning!',
  onClose = () => {},
  closeText = 'Close',
  parseHtml = false,
  textAlign = 'center',
}: WarningModalProps) => {
  const theme = useTheme();

  const modalId = MODAL.GLOBAL.WARNING;
  const modal = useModal(modalId);

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
            iconName="warning"
            sx={{
              color: theme.palette.warning.main,
              fontSize: theme.spacing(8.25),
            }}
          />
          <TextStyle
            variant="display2"
            color={theme.palette.custom.lightYellow}
            weight={700}
            sx={{ textAlign: 'center' }}
          >
            Warning!!
          </TextStyle>

          <TextStyle sx={{ textAlign }}>
            {parseHtml ? parse(title) : title}
          </TextStyle>
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
              onClose();
              closeNiceModal(modalId);
            }}
          >
            {closeText}
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </Dialog>
  );
});

export default WarningModal;
