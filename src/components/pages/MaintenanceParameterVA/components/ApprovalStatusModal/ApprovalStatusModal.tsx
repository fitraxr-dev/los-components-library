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

import { NavigationProvider } from '../../context/NavigationContext';

import { useApprovalStatusModal } from './ApprovalStatusModal.hooks';


const ApprovalStatusModal = NiceModal.create(() => {
  const modal = useModal();

  return (
    <NavigationProvider>
      <ApprovalStatusModalContent modal={modal} />
    </NavigationProvider>
  );
});

const ApprovalStatusModalContent = ({ modal }) => {
  const {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    setFilter,
    setPage,
    setPageSize,
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
        <Table
          maxHeight="42vh"
          isLoading={isLoading}
          tableHeader={tableHeader}
          tableData={tableData}
          currentPage={page}
          totalPage={tablePage?.totalPage ?? 1}
          handlePageChange={setPage}
          onPageSizeChange={setPageSize}
        />
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
