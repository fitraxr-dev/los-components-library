'use client';
import React from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import ListFilter from '../ListFilter';

import { MODAL } from './HistoryModal.constants';
import useHistoryModal from './HistoryModal.hook';


const HistoryModal = NiceModal.create(() => {
  const modalId = MODAL.HISTORY_MODAL;
  const modal = useModal(modalId);

  const {
    contentList,
    tableHeader,
    setPage,
    setPageSize,
    historyPage,
    isLoading,
    filter,
    setFilter,
  } = useHistoryModal();

  return (
    <SectionModal
      title="History Modal"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '75vw' }}
    >
      <RowWrapper>
        <ListFilter
          localValue={filter}
          onChangeValue={setFilter}

        />
      </RowWrapper>

      <ColumnWrapper sx={{ gap: 3 }}>
        <Table
          isLoading={isLoading}
          maxHeight="50vh"
          tableHeader={tableHeader}
          tableData={contentList}
          handlePageChange={setPage}
          onPageSizeChange={setPageSize}
          currentPage={historyPage?.noPage}
          totalPage={historyPage?.totalPage}
          pageSize={historyPage?.itemPerPage}
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

export default HistoryModal;
