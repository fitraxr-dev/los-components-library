'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';


interface DetailSubItemModalProps {
  data?: {
    noSubItem?: string;
    active?: boolean;
    subItem?: string;
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

const DetailSubItemModal = NiceModal.create(({ data }: DetailSubItemModalProps) => {
  const modalId = 'MODAL_DETAIL_SUB_ITEM';
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
      title="Detail Sub Item"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={footer}
    >
      <ColumnWrapper sx={{ gap: 2 }}>
        <Box>
          <Input
            type="text"
            label="No. Sub Item"
            value={data?.noSubItem || ''}
            disabled={true}
            placeholder="Enter No. Sub Item"
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
            label="Sub Item"
            value={removeHtml(data?.subItem) || '-'}
            disabled={true}
            placeholder="Enter Sub Item description"
            rows={4}
          />
        </Box>

      </ColumnWrapper>
    </SectionModal>
  );
});

export default DetailSubItemModal;
