'use client';
import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modal as MODAL } from '../../List.constants';

import useModalApproval from './ModalApproval.hook';


const ModalApproval = NiceModal.create(() => {
  const modalId = MODAL.APPROVAL;
  const modal = useModal(modalId);

  const {
    data,
    setPage,
    setPageSize,
    tableHeader,
    isLoading,
    page,
    filter,
    setFilter,
    filterContentList,
    filterDropdownList,
  } = useModalApproval(modalId);

  return (
    <SectionModal
      title="Approval Status"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '70vw' }}
    >
      <Input
        type="search"
        value={filter}
        onChange={setFilter}
        placeholder="Pencarian..."
        dropdownList={filterDropdownList}
        contentList={filterContentList}
      />
      <Table
        maxHeight="50vh"
        tableHeader={tableHeader}
        tableData={data?.contents}
        currentPage={page}
        totalPage={data?.page?.totalPage}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
        isLoading={isLoading}
      />
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

export default ModalApproval;
