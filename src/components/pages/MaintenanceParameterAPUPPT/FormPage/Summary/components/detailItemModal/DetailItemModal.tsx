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


interface DetailItemModalProps {
  data?: {
    nomorItem?: string;
    active?: boolean;
    redirectToMaintenanceCustomer?: boolean;
    item?: string;
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

const DetailItemModal = NiceModal.create(({ data }: DetailItemModalProps) => {
  const modalId = 'MODAL_DETAIL_ITEM';
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
      title="Detail Item"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={footer}
    >
      <ColumnWrapper sx={{ gap: 2 }}>
        <Box>
          <Input
            type="text"
            label="Nomor Item"
            value={data?.nomorItem || '-'}
            disabled={true}
            placeholder="Enter Nomor Item"
          />
        </Box>

        <Box>
          <Input
            type="radio"
            label="Active"
            value={data?.active ? 'true' : 'false'}
            disabled={true}
            radioList={[
              { label: 'Ya', value: true },
              { label: 'Tidak', value: false }
            ]}
            position="horizontal"
          />
        </Box>

        <Box>
          <Input
            type="area"
            label="Item"
            value={removeHtml(data?.item) || '-'}
            disabled={true}
            placeholder="Enter Item description"
            rows={4}
          />
        </Box>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default DetailItemModal;
