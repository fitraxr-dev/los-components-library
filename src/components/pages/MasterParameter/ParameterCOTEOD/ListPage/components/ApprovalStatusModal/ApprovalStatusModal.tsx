'use client';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { MODAL } from '../../List.constant';

import useApprovalStatusModal from './ApprovalStatusModal.hook';


const ApprovalStatusModal = NiceModal.create(() => {
  const theme = useTheme();
  const modalId = MODAL.APPROVAL_STATUS_MODAL;
  const modal = useModal(modalId);

  const {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  } = useApprovalStatusModal();

  return (
    <SectionModal
      title="Approval Status"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customHeader={
        <RowWrapper
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 1,
          }}
        >
          <TextStyle variant="body1" weight={700} color={theme.palette.primary.main}>
            Approval Status
          </TextStyle>
          <Input
            type="search"
            value={filter}
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
            sx={{ width: '45vw' }}
          />
        </RowWrapper>
      }
      containerSx={{ minWidth: '80vw' }}
    >
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          maxHeight="50vh"
          tableHeader={tableHeader}
          tableData={tableData}
          totalPage={totalPage ?? 1}
          currentPage={page}
          handlePageChange={setPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
          isLoading={isLoading}
          withConditional={true}
        />
      </BaseContainer>
    </SectionModal>
  );
});

export default ApprovalStatusModal;
