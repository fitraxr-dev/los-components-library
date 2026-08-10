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

import { modal as MODAL } from '../../ListPage/MaintenanceProyek.constants';

import useApprovalStatusModal from './ApprovalStatusModal.hooks';


const ApprovalStatusModal = NiceModal.create(() => {
  const modalId = MODAL.APPROVAL_STATUS_MODAL;
  const modal = useModal(modalId);

  const {
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
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '70vw' }}
    >
      <Box width="70%">
        <Input
          type="search3"
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
          currentPage={noPage}
          totalPage={tablePage?.totalPage ?? 1}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
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
