'use client';
import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import useApprovalStatusModal from '@/components/pages/MaintenanceData/MaintenanceGroup/components/ApprovalStatusModal/ApprovalStatusModal.hooks';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Search from '@/components/shared/Input/components/Search';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modal as MODAL } from '../../ListPage/MaintenanceGroup.constants';


const ApprovalStatusModal = NiceModal.create(() => {
  const modalId = MODAL.APPROVAL_STATUS_MODAL;
  const modal = useModal(modalId);

  const {
    contentList,
    tableHeader,
    setPage,
    setPageSize,
    submissionPage,
    filter,
    setFilter,
    filterDropdownList,
    filterContentList,
  } = useApprovalStatusModal();

  return (
    <SectionModal
      title="Approval Status"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '52vw' }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Search
          value={filter}
          isDebounced
          hasFilter
          onChange={setFilter}
          placeholder="Pencarian..."
          dropdownList={filterDropdownList}
          contentList={filterContentList}
        />
        <Table
          maxHeight="50vh"
          tableHeader={tableHeader}
          tableData={contentList}
          handlePageChange={setPage}
          onPageSizeChange={setPageSize}
          currentPage={submissionPage?.noPage}
          totalPage={submissionPage?.totalPage}
          pageSize={submissionPage?.itemPerPage}
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
