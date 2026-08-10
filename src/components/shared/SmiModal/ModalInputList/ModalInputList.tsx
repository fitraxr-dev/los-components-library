import React from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import InputList from '@/components/shared/InputList';
import RowWrapper from '@/components/shared/RowWrapper';

import SectionModal from '../SectionModal';


const ModalInputList = create(({
  title,
  onConfirm,
  onConfirmText,
  hasConfirm = true,
  fieldList,
  column = 4,
  isLoading = false,
  sx,
}: ModalInputListProps) => {
  const theme = useTheme();
  const modalId = MODAL.MODAL_INPUT_LIST;
  const modal = useModal(modalId);

  return (
    <SectionModal
      title={title}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={
        {
          '-ms-overflow-style': 'none',
          minWidth: '52vw',
          'scrollbar-width': 'none',
          ...sx,
        }
      }
    >
      <InputList fieldList={fieldList} column={column} />
      <RowWrapper
        gap={theme.spacing(3)}
        paddingTop={theme.spacing(3)}
        justifyContent="end"
      >
        <Button
          variant="outlined"
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>
        {hasConfirm && (
          <Button
            isLoading={isLoading}
            onClick={onConfirm}
          >
            {onConfirmText || 'Confirm'}
          </Button>)
        }
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalInputList;
