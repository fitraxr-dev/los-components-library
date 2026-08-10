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

import { LIST_DATA_APPROVAL } from '../../../__mocks__/mockData';
import { modal } from '../../List.constants';

import useModalApproval from './ModalApproval.hook';


const ModalApproval = NiceModal.create(() => {
  const modalId = modal.APPROVAL;
  const { visible } = useModal(modalId);

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
  } = useModalApproval();

  return (
    <SectionModal
      title="Approval Status"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '65vw' }}
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
          currentPage={noPage}
          totalPage={tablePage?.totalPage ?? 1}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
        />
      </ColumnWrapper>
      <RowWrapper mt={2} sx={{ justifyContent: 'end' }}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalApproval;
