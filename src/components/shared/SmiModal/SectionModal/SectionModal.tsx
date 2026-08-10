'use client';
import React from 'react';

import { Dialog, useTheme } from '@mui/material';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalTransition from '@/components/shared/SmiModal/ModalTransition';
import TextStyle from '@/components/shared/TextStyle';

import type { SectionModalProps } from './SectionModal.types';

/**
 * SectionModal component
 * @example
 * <SectionModal title="Modal Title">
 * <div>Modal Content</div>
 * </SectionModal>
 * @param {React.ReactNode} children - Modal Content
 * @param {React.ReactNode} customFooter - Custom Footer
 * @param {boolean} isOpen - Modal Open State
 * @param {() => void} onClose - Modal Close Handler
 * @param {() => void} onConfirm - Modal Confirm Handler
 * @param {object} containerSx - Modal Container Style
 * @param {string} title - Modal Title
 * @param {boolean} withConfirm - Modal with Confirm Button
 * @returns {React.FC}
 * @constructor
 */
const SectionModal = ({
  children,
  customHeader,
  customFooter,
  isOpen = false,
  onClose = () => { },
  onConfirm = () => { },
  containerSx = { minWidth: '75vw' },
  title,
  withConfirm = false,
  closeBtnText = 'Close',
}: SectionModalProps) => {
  const theme = useTheme();

  return (
    <Dialog
      TransitionComponent={ModalTransition}
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: theme.radius(2),
          padding: theme.spacing(4),
          ...containerSx,
        },
      }}
    >
      {customHeader}
      {!customHeader && title && (
        <RowWrapper
          sx={{
            borderBottom: '0.1vw solid',
            borderColor: theme.palette.custom.gray30,
            justifyContent: 'center',
            marginBottom: theme.spacing(4),
            p: 1,
          }}
        >
          <TextStyle variant="body1" color={theme.palette.primary.main}>
            {title}
          </TextStyle>
        </RowWrapper>
      )}

      {children}

      {customFooter || (
        <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
          <Button variant="outlined" sx={{ mr: 3 }} onClick={onClose}>
            {closeBtnText}
          </Button>
          {withConfirm && <Button onClick={onConfirm}>Confirm</Button>}
        </RowWrapper>
      )}
    </Dialog>
  );
};

export default SectionModal;
