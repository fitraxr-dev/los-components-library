'use client';
import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { useApprovalStatusModal } from './ApprovalStatusModal.hooks';


const ApprovalStatusModal = NiceModal.create(() => {
  const modal = useModal();

  const {
    error,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    itemPerPage,
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
      containerSx={{ minWidth: '75vw' }}
    >
      <Input
        type="search3"
        value={filter}
        onChange={setFilter}
        placeholder="Pencarian..."
        contentList={filterContentList}
        dropdownList={filterDropdownList}
        sx={{ width: '45vw' }}
      />
      {error ? (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <p>Error loading approval status data. Please try again.</p>
        </Box>
      ) : (
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            maxHeight="50vh"
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={tableData}
            currentPage={noPage}
            totalPage={tablePage?.totalPage ?? 1}
            pageSize={itemPerPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
          />
        </BaseContainer>
      )}
      <RowWrapper sx={{ justifyContent: 'end' }}>
        <Button variant="outlined" onClick={() => modal.hide()}>
          Close
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ApprovalStatusModal;
