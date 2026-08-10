'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';


const removeHtml = (value?: string) => {
  if (!value) return '-';
  if (typeof value === 'string' && value.includes('<')) {
    return value.replace(/<[^>]*>/g, '').trim();
  }
  return value;
};

const DetailGroupUpdateModal = NiceModal.create(({ data }: any) => {
  const modalId = 'MODAL_DETAIL_GROUP_UPDATE';
  const modal = useModal(modalId);

  // Extract data from the API response structure
  const contentData = data?.contents?.[0];
  const previousData = contentData?.previous;
  const lastModifiedData = contentData?.lastModified;

  console.log(data, 'data');
  console.log(previousData, 'previousData');
  console.log(lastModifiedData, 'lastModifiedData');

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
      title="Detail Group Update"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={footer}
    >
      <ColumnWrapper sx={{ gap: 4 }}>
        {/* Previous Section */}
        <ColumnWrapper sx={{ gap: 2 }}>
          <Box sx={{ color: 'primary.main', fontSize: '16px', fontWeight: 'bold' }}>
            Previous
          </Box>
          <Box>
            <Input
              type="text"
              label="No. Item Group"
              value={previousData?.noItemGroup?.toString() || '-'}
              disabled={true}
              placeholder="Enter No. Item Group"
            />
          </Box>

          <Box>
            <Input
              type="radio"
              label="Active"
              value={previousData?.isActive ? 'true' : 'false'}
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
              value={removeHtml(previousData?.itemGroup) || '-'}
              disabled={true}
              placeholder="Enter Item Group description"
              rows={4}
            />
          </Box>
        </ColumnWrapper>

        {/* Last Modified Section */}
        <ColumnWrapper sx={{ gap: 2 }}>
          <Box sx={{ color: 'primary.main', fontSize: '16px', fontWeight: 'bold' }}>
            Last Modified
          </Box>
          <Box>
            <Input
              type="text"
              label="No. Item Group"
              value={lastModifiedData?.noItemGroup?.toString() || '-'}
              disabled={true}
              placeholder="Enter No. Item Group"
            />
          </Box>

          <Box>
            <Input
              type="radio"
              label="Active"
              value={lastModifiedData?.isActive ? 'true' : 'false'}
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
              value={removeHtml(lastModifiedData?.itemGroup) || '-'}
              disabled={true}
              placeholder="Enter Item Group description"
              rows={4}
            />
          </Box>
        </ColumnWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default DetailGroupUpdateModal;
