'use client';
import React, { useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, Dialog, Radio, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { addAlphaToHex } from '@/helpers/colors';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import ModalTransition from '../ModalTransition';

import type { SelectorModalProps } from './SelectorModal.types';

/**
 * SelectorModal component is a part of the NiceModal library and provides a selection modal with options.
 *
 * @component
 * @example
 * // Example of using the SelectorModal component to show a selection modal
 * NiceModal.show(MODAL.GLOBAL.SELECTOR, {
 *   title: 'Select an option',
 *   data: [
 *     { key: 'option1', label: 'Option 1', description: 'Description of Option 1' },
 *     { key: 'option2', label: 'Option 2', description: 'Description of Option 2' },
 *     // ...additional options
 *   ],
 *   onSubmit: (selectedOption) => {
 *     // Handle submission logic with the selected option
 *   },
 *   nextStep: (selectedOption) => {
 *     // Handle the next step logic with the selected option
 *   },
 * });
 *
 * @param {Object} [options] - Options for configuring the SelectorModal.
 * @param {string} [options.title] - The title of the selection modal.
 * @param {Array} [options.data] - An array of objects representing the selectable options.
 * @param {string} [options.data[].key] - The unique key for the option.
 * @param {string} [options.data[].label] - The label or name of the option.
 * @param {string} [options.data[].description] - The optional description of the option.
 * @param {Function} [options.onSubmit] - Callback function triggered when the user clicks the "Confirm" button.
 * @param {Function} [options.nextStep] - Callback function triggered after confirming the selection.
 * @returns {JSX.Element} JSX.Element
 */

const SelectorModal = NiceModal.create(({
  title,
  data,
  onSubmit,
  nextStep,
  submitText = 'Confirm',
  isLoading,
}: SelectorModalProps) => {
  const [selected, setSelected] = useState(null);
  const theme = useTheme();

  const modalId = MODAL.GLOBAL.SELECTOR;
  const modal = useModal(modalId);

  const handleOptionClick = (item: any) => {
    if (!item.disabled) {
      setSelected(item.key);
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
        <RowWrapper
          sx={{
            borderBottom: 1,
            borderColor: theme.palette.custom.gray30,
            borderWidth: '0.02vw',
            justifyContent: 'center',
          }}
        >
          <TextStyle
            weight={600}
            variant="body1"
            color={theme.palette.primary.main}
            sx={{ py: theme.spacing(1) }}
          >
            {title}
          </TextStyle>
        </RowWrapper>
        <ColumnWrapper
          sx={{
            gap: theme.spacing(3),
          }}
        >
          {data?.map((item, index) => (
            <Box
              key={index}
              sx={{
                '&:hover': {
                  backgroundColor: item.disabled
                    ? theme.palette.action.disabledBackground
                    : addAlphaToHex(theme.palette.primary.main, 0.05),
                },
                backgroundColor: item.disabled
                  ? theme.palette.action.disabledBackground
                  : selected === item.key
                    ? addAlphaToHex(theme.palette.primary.main, 0.075)
                    : 'white',
                borderColor: item.disabled
                  ? theme.palette.action.disabled
                  : selected === item.key
                    ? theme.palette.primary.main
                    : theme.palette.custom.gray30,
                borderRadius: theme.radius(1),
                borderStyle: 'solid',
                borderWidth: theme.spacing(0.2),
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.6 : 1,
                px: theme.spacing(3),
                py: theme.spacing(2),
              }}
              onClick={() => handleOptionClick(item)}
            >
              <RowWrapper
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <ColumnWrapper>
                  <TextStyle
                    variant="body4"
                    weight={500}
                    color={item.disabled
                      ? theme.palette.text.disabled
                      : theme.palette.primary.main
                    }
                  >
                    {item.label}
                  </TextStyle>
                  {item.description && (
                    <TextStyle
                      variant="body4"
                      sx={{ mt: 1 }}
                      color={item.disabled ? theme.palette.text.disabled : 'inherit'}
                    >
                      {item.description}
                    </TextStyle>
                  )}
                </ColumnWrapper>
                <Radio
                  checked={selected === item.key}
                  disabled={item.disabled}
                  name="card-radio-selector"
                  value={item.key}
                  sx={{
                    '& svg': {
                      height: theme.spacing(3),
                      width: theme.spacing(3),
                    },
                    '&.Mui-disabled': {
                      opacity: 0.5,
                    },
                    marginLeft: theme.spacing(2),
                    padding: 0,
                  }}
                />
              </RowWrapper>
            </Box>
          ))}
        </ColumnWrapper>
        <RowWrapper
          sx={{
            gap: theme.spacing(2),
            justifyContent: 'center',
          }}
        >
          <Button variant="outlined" isFull onClick={() => closeNiceModal(modalId)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            isFull
            isLoading={isLoading}
            disabled={selected === null}
            onClick={() => {
              setSelected(null);
              if (onSubmit) {
                onSubmit(selected);
                closeNiceModal(modalId);
              }
              nextStep && nextStep(selected);
            }}
          >
            {submitText}
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </Dialog>
  );
});

export default SelectorModal;
