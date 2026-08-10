'use client';
import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modal as MODAL } from '../../ListPage/List.constants';

import useApprovalModal from './ApprovalModal.hook';


const ApprovalModal = NiceModal.create((
  { existing }: any) => {
  const theme = useTheme();
  const modalId = MODAL.APPROVAL_MODAL;
  const modal = useModal(modalId);

  const {
    data,
    contentList,
    noPage,
    setItemPerPage,
    setNoPage,
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
          tableData={contentList}
          totalPage={data?.page?.totalPage}
          currentPage={noPage}
          handlePageChange={setNoPage}
          onPageSizeChange={setItemPerPage}
          isLoading={isLoading}
        />
      </ColumnWrapper>
      <RowWrapper sx={{ justifyContent: 'end' }}>
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
