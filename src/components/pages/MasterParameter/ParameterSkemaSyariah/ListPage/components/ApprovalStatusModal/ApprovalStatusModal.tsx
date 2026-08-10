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
      containerSx={{ minWidth: '80vw' }}
    >
      <Input
        type="search"
        value={filter}
        onChange={setFilter}
        placeholder="Pencarian..."
        dropdownList={filterDropdownList}
        contentList={filterContentList}
        sx={{ width: '45vw' }}
      />
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
        />
      </BaseContainer>
    </SectionModal>
  );
});

export default ApprovalStatusModal;
