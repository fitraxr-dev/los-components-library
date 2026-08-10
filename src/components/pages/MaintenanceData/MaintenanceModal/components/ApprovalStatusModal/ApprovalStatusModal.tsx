'use client';
import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { MODAL } from './ApprovalStatusModal.constants';
import useApprovalStatusModal from './ApprovalStatusModal.hooks';


const ApprovalStatusModal = NiceModal.create(() => {
  const modalId = MODAL.APPROVAL_MODAL;
  const modal = useModal(modalId);

  const {
    contentList,
    tableHeader,
    setPage,
    setPageSize,
    approvalPage,
    isLoading,
    filter,
    setFilter,
    filterDropdownListApproval,
    filterContentListApproval,
  } = useApprovalStatusModal();

  return (
    <SectionModal
      title="Approval Status"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '75vw' }}
    >
      <RowWrapper sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box width="100%">
          <Input
            type="search"
            value={filter}
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownListApproval}
            contentList={filterContentListApproval}
          />
        </Box>
      </RowWrapper>

      <ColumnWrapper sx={{ gap: 3 }}>
        <Table
          isLoading={isLoading}
          maxHeight="50vh"
          tableHeader={tableHeader}
          tableData={contentList}
          handlePageChange={setPage}
          onPageSizeChange={setPageSize}
          currentPage={approvalPage?.noPage}
          totalPage={approvalPage?.totalPage}
          pageSize={approvalPage?.itemPerPage}
        />
      </ColumnWrapper>
      <RowWrapper sx={{ justifyContent: 'end' }}>
        <Button variant="outlined" onClick={() => closeNiceModal(modalId)}>
          Close
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ApprovalStatusModal;
