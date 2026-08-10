'use client';
import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Dialog, useTheme, Box } from '@mui/material';
import parse from 'html-react-parser';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import ModalTransition from '@/components/shared/SmiModal/ModalTransition';
import TextStyle from '@/components/shared/TextStyle';
import VStack from '@/components/shared/VStack';

import type { ErrorModalProps } from './ErrorModal.types';

/**
 * ErrorModal component is a part of the NiceModal library and displays an error message in a modal.
 *
 * @component
 * @example
 * // Example of using the ErrorModal component to display an error message
 * NiceModal.show(MODAL.GLOBAL.ERROR, {
 *   title: 'Terjadi kesalahan, silahkan mencoba lagi.',
 * });
 *
 * @param {Object} options - Options for configuring the ErrorModal.
 * @param {string} [options.title='Terjadi kesalahan, silahkan mencoba lagi.'] - The title of the error modal.
 * @returns {JSX.Element} JSX.Element
 */

const ErrorModal = NiceModal.create(({
  customProp = {
    header: 'Error!',
    sx: { textAlign: 'center' },
    variant: 'display2',
  },
  title = 'Terjadi kesalahan, silahkan mencoba lagi.',
  onClose = () => { },
}: ErrorModalProps) => {
  const theme = useTheme();

  const modalId = MODAL.GLOBAL.ERROR;
  const modal = useModal(modalId);

  return (
    <Dialog
      TransitionComponent={ModalTransition}
      open={modal.visible}
      onClose={() => closeNiceModal(modalId)}
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
            iconName="error"
            sx={{
              color: theme.palette.error.main,
              fontSize: theme.spacing(12),
            }}
          />
          <TextStyle
            variant={customProp.variant}
            color={theme.palette.custom.softRed}
            weight={700}
            sx={customProp.sx}
          >
            {customProp.header}
          </TextStyle>

          <Box
            sx={{
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
              textAlign: 'center',
              width: '100%',
            }}
          >
            <TextStyle
              sx={{
                ...customProp.sx,
                lineHeight: '1.5',
                textAlign: 'center',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {typeof title === 'string' ? parse(title) : title}
            </TextStyle>
          </Box>
        </VStack>

        <Button
          variant="outlined"
          isFull
          onClick={() => {
            closeNiceModal(modalId);
            onClose();
          }}
        >
          Close
        </Button>
      </ColumnWrapper>
    </Dialog>
  );
});

export default ErrorModal;
