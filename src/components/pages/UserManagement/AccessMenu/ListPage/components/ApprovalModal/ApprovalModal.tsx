'use client';
import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modal as MODAL } from '../../List.constants';

import useApprovalModal from './ApprovalModal.hook';


const ApprovalModal = NiceModal.create(() => {
  const theme = useTheme();
  const modalId = MODAL.APPROVAL_MODAL;
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
  } = useApprovalModal();

  return (
    <SectionModal
      title="Approval Status"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '65vw' }}
    >
      <Box width="45vw">
        <Input
          type="search"
          value={filter}
          onChange={setFilter}
          placeholder="Pencarian..."
          dropdownList={filterDropdownList}
          contentList={filterContentList}
        />
      </Box>
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
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
      <RowWrapper mt={theme.spacing(2)} sx={{ justifyContent: 'end' }}>
        <Button
          variant="outlined"
          sx={{ mr: theme.spacing(3) }}
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button>
      </RowWrapper>
    </SectionModal>
  );
},
);

export default ApprovalModal;
