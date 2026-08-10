import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { modal } from '../../TableSpecialApproval.constants';

import type { ModalSpecialApprovalDetailProps } from './ModalSpecialApprovalDetail.types';


const ModalSpecialApprovalDetail = NiceModal.create(({ type = 'OTHERS', initialValues }: ModalSpecialApprovalDetailProps) => {
  const modalId = modal.SPECIAL_APPROVAL_DETAIL;
  const { visible } = useModal(modalId);
  const theme = useTheme();

  const creditCheckingDetail = [{
    title: 'Persetujuan Khusus',
    value: initialValues.typeSpecialApproval === 'OTHERS' ? initialValues.specialNote : initialValues.typeSpecialApprovalLabel,
  },
  {
    title: 'Deskripsi',
    value: initialValues.description,
  }];

  return (
    <SectionModal
      title={`Detail Jenis Persetujuan Khusus${type === 'OTHERS' ? ' - Lainnya' : ''}` }
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '30vw' }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <ColumnWrapper
          sx={{
            alignItems: 'end',
            gap: theme.spacing(2),
            justifyContent: 'end',
          }}
        >
          {creditCheckingDetail.map((item, index) => (
            <Cell key={index} title={item.title} value={item.value} />
          ))}
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
            sx={{ width: '25%' }}
          >
            Cancel
          </Button>
        </ColumnWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalSpecialApprovalDetail;
