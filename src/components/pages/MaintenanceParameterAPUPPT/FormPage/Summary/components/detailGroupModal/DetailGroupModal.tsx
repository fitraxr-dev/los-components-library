'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';


interface DetailGroupModalProps {
  data?: {
    noItemGroup?: string;
    isActive?: boolean;
    itemGroup?: string;
  };
  viewOnly?: boolean;
}

const removeHtml = (value?: string) => {
  if (!value) return '-';
  if (typeof value === 'string' && value.includes('<')) {
    return value.replace(/<[^>]*>/g, '').trim();
  }
  return value;
};

const DetailGroupModal = NiceModal.create(({ data }: DetailGroupModalProps) => {
  const modalId = 'MODAL_DETAIL_GROUP';
  const modal = useModal(modalId);

  const footer = (
    <RowWrapper sx={{ gap: 3, justifyContent: 'end', mt: 5 }}>
      <Button
        variant="outlined"
        onClick={() => closeNiceModal(modalId)}
      >
        Close
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      title="Detail Group"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={footer}
    >
      <ColumnWrapper sx={{ gap: 2 }}>
        <Box>
          <Input
            type="text"
            label="No. Item Group"
            value={data?.noItemGroup || '4'}
            disabled={true}
            placeholder="Enter No. Item Group"
          />
        </Box>

        <Box>
          <Input
            type="radio"
            label="Active"
            value={data?.isActive ? 'true' : 'false'}
            disabled={true}
            radioList={[
              { label: 'Ya', value: 'true' },
              { label: 'Tidak', value: 'false' }
            ]}
            position="horizontal"
          />
        </Box>

        <Box>
          <Input
            type="area"
            label="Item Group"
            value={removeHtml(data?.itemGroup) || '-'}
            disabled={true}
            placeholder="Enter Item Group description"
            rows={4}
          />
        </Box>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default DetailGroupModal;
