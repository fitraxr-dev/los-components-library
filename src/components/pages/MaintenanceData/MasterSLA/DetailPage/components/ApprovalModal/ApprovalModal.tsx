'use client';
import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modal as MODAL } from '../../Detail.constants';

import useApprovalModal from './ApprovalModal.hook';


const ApprovalModal = NiceModal.create(() => {
  const modalId = MODAL.APPROVAL_MODAL;
  const modal = useModal(modalId);

  const {
    data,
    setPage,
    setPageSize,
    tableHeader,
    isLoading,
  } = useApprovalModal(modalId);

  return (
    <SectionModal
      title="Approval List"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '52vw' }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Table
          maxHeight="50vh"
          tableHeader={tableHeader}
          tableData={data?.contents}
          handlePageChange={setPage}
          onPageSizeChange={setPageSize}
          isLoading={isLoading}
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
},
);

export default ApprovalModal;
