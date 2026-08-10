'use client';

import React, { useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const UploadResultModal = NiceModal.create(() => {
  const modal = useModal();

  return <UploadResultModalContent modal={modal} />;
});

const UploadResultModalContent = ({ modal }) => {
  const theme = useTheme();
  const {
    initialData,
  } = modal.args || {};

  // Extract data from initialData if available
  const data = initialData || modal.args || {};
  const isSuccess = data.status === 'SUCCESS' || data.status === 'Success' || data.status === 'Berhasil';
  const statusColor = isSuccess ? theme.palette.success.main : theme.palette.error.main;
  const statusText = isSuccess ? 'Success' : 'Failed';

  // Pagination state for error table
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);


  // Table headers for failed records
  const failedTableHeaders: TableHeader[] = [
    { key: 'index', label: 'No', sx: { minWidth: '4vw' }, type: 'index' },
    { key: 'row', label: 'Row Number', sx: { minWidth: '6vw' } },
    { key: 'errorMessage', label: 'Error Message', sx: { minWidth: '20vw' } },
  ];

  // Parse failed records from message
  let allFailedRecords = [];
  if (data.message && Array.isArray(data.message)) {
    allFailedRecords = data.message;
  } else if (data.message && typeof data.message === 'object') {
    // Convert message object to array format (legacy support)
    allFailedRecords = Object.entries(data.message).map(([row, errors]) => ({
      errorMessage: Array.isArray(errors) ? errors.join(', ') : errors,
      row: row.replace('Row ', ''),
    }));
  } else if (data.failedRecords) {
    allFailedRecords = data.failedRecords;
  }

  // Calculate pagination
  const totalRecords = allFailedRecords.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedFailedRecords = allFailedRecords.slice(startIndex, endIndex);

  return (
    <SectionModal
      isOpen={modal.visible}
      onClose={() => modal.hide()}
      customFooter={() => null}
      containerSx={{ minWidth: isSuccess ? '30vw' : '40vw' }}
    >
      <ColumnWrapper sx={{ gap: 2 }}>
        <RowWrapper sx={{ alignItems: 'center', gap: 1, mb: 3, mt: 2 }}>
          <TextStyle variant="body1" weight={600}>
            Status:
          </TextStyle>
          <TextStyle variant="body1" weight={600} color={statusColor}>
            {statusText}
          </TextStyle>
        </RowWrapper>

        {/* Total Processed */}
        <RowWrapper sx={{ alignItems: 'center', gap: 1 }}>
          <TextStyle variant="body2" weight={600}>
            Jumlah Data Diproses: {data.totalRecords || data.totalProcessed || 0}
          </TextStyle>
        </RowWrapper>

        {/* Success/Failed Count */}
        {isSuccess ? (
          <RowWrapper sx={{ alignItems: 'center', gap: 1 }}>
            <TextStyle variant="body2" weight={600}>
              Jumlah Data Berhasil: {data.totalSuccess || data.totalRecords || data.totalProcessed || 0}
            </TextStyle>
          </RowWrapper>
        ) : (
          <>
            <RowWrapper sx={{ alignItems: 'center', gap: 1 }}>
              <TextStyle variant="body2" weight={600}>
                Jumlah Data Gagal:{' '}
                {data.totalErrors || data.totalFailed || data.totalRecords || data.totalProcessed || 0}
              </TextStyle>
            </RowWrapper>

            {/* Failed Records Table */}
            {allFailedRecords && allFailedRecords.length > 0 && (
              <ColumnWrapper sx={{ gap: 2, mt: 2 }}>
                <Table
                  tableHeader={failedTableHeaders}
                  tableData={paginatedFailedRecords}
                  isLoading={false}
                  currentPage={currentPage}
                  totalPage={totalPages}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  handlePageChange={setCurrentPage}
                />
              </ColumnWrapper>
            )}
          </>
        )}
      </ColumnWrapper>

      {/* Button Close - Different styling based on status */}
      {isSuccess ? (
        <Button
          variant="outlined"
          onClick={() => modal.hide()}
          isFull
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.grey[50],
              borderColor: theme.palette.grey[600],
            },
            borderColor: theme.palette.grey[400],
            color: theme.palette.grey[700],
            mt: 3,
          }}
        >
          Close
        </Button>
      ) : (
        <RowWrapper sx={{ justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => modal.hide()}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.grey[50],
                borderColor: theme.palette.grey[600],
              },
              borderColor: theme.palette.grey[400],
              color: theme.palette.grey[700],
            }}
          >
            Close
          </Button>
        </RowWrapper>
      )}
    </SectionModal>
  );
};

export default UploadResultModal;
