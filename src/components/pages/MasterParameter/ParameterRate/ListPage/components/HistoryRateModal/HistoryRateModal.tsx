'use client';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Input from '@/components/shared/Input';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { MODAL } from '../../List.constant';

import useApprovalStatusModal from './HistoryRateModal.hook';


const ApprovalStatusModal = NiceModal.create(() => {
  const theme = useTheme();
  const modalId = MODAL.HISTORY_RATE_MODAL;
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
      title="History Rate"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{ minWidth: '75vw' }}
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
          withConditional={true}
        />
      </BaseContainer>
    </SectionModal>
  );
});

export default ApprovalStatusModal;
