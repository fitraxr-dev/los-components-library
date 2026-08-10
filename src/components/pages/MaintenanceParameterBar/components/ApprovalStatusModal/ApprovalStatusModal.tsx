'use client';
import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { useApprovalStatusModal } from './ApprovalStatusModal.hooks';


const ApprovalStatusModal = NiceModal.create(() => {
  const modal = useModal();

  return <ApprovalStatusModalContent modal={modal} />;
});

const ApprovalStatusModalContent = ({ modal }) => {
  const {
    error,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
  } = useApprovalStatusModal();


  return (
    <SectionModal
      title="Approval Status"
      isOpen={modal.visible}
      onClose={() => modal.hide()}
      customFooter={() => null}
      containerSx={{ minWidth: '70vw' }}
    >
      <Box width="70%">
        <Input
          type="search"
          value={filter}
          onChange={setFilter}
          placeholder="Pencarian..."
          contentList={filterContentList}
          dropdownList={filterDropdownList}
        />
      </Box>
      <ColumnWrapper sx={{ gap: 3 }}>
        {error ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <p>Error loading approval status data. Please try again.</p>
          </Box>
        ) : (
          <Table
            maxHeight="42vh"
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={tableData}
            currentPage={noPage}
            totalPage={tablePage?.totalPage ?? 1}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
          />
        )}
      </ColumnWrapper>
      <RowWrapper sx={{ justifyContent: 'end' }}>
        <Button variant="outlined" onClick={() => modal.hide()}>
          Close
        </Button>
      </RowWrapper>
    </SectionModal>
  );
};

export default ApprovalStatusModal;
