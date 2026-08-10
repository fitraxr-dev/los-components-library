'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modal } from '../../List.constants';

import { useModalCustomerCheck } from './ModalCustomerCheck.hook';


const ModalCustomerCheck = NiceModal.create(() => {
  const modalId = modal.CUSTOMER_CHECK;
  const { visible } = useModal(modalId);
  const theme = useTheme();
  const {
    filter,
    setFilter,
    page,
    setPage,
    setPageSize,
    filterDropdownList,
    filterContentList,
    isLoading,
    tableHeader,
    tableData,
  } = useModalCustomerCheck();

  return (
    <SectionModal
      title="Customer Check"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        maxHeight: '75vh',
        maxWidth: '75vw',
        minWidth: '75vw',
      }}
    >
      <ColumnWrapper gap={theme.spacing(1)} mb={theme.spacing(1)}>
        <Box width="71.65vw">
          <Input
            type="search"
            value={filter}
            hasFilter
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
        </Box>
      </ColumnWrapper>
      <Table
        isPaper
        isLoading={isLoading}
        maxHeight="23.5vw"
        tableHeader={tableHeader}
        tableData={tableData?.contents ?? []}
        totalPage={tableData?.page?.totalPage ?? 1}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </SectionModal>
  );
});


export default ModalCustomerCheck;
