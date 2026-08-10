'use client';
import { create, useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { useApprovalList } from './ApprovalList.hook';


const ApprovalList = create(() => {
  const theme = useTheme();
  const modalId = MODAL.APPROVAL_LIST_SKU;
  const modal = useModal(modalId);

  const {
    filter,
    approvalList,
    approvalPage,
    isLoading,
    setFilter,
    page,
    setPage,
    setItemPerPage,
    filterContentList,
    filterDropdownList,
    tableHeaderApproval,
  } = useApprovalList();

  return (
    <SectionModal
      title="Approval Status"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        minWidth: '80vw',
      }}
    >
      <ColumnWrapper gap={theme.spacing(1)} marginBottom={theme.spacing(5)}>
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

        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeaderApproval}
            tableData={approvalList}
            totalPage={approvalPage?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setItemPerPage}
          />
        </BaseContainer>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ApprovalList;
