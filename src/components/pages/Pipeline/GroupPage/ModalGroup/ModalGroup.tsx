'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { pipeline } from '@/configs/constants/pathname';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';


import { useModalGroup } from './ModalGroup.hook';

import type { PipelineContextType } from '@/components/layouts/PipelineLayout/Pipeline.context';


const ModalGroup = NiceModal.create(({
  state,
  setState,
}: PipelineContextType
) => {
  const modalId = MODAL.GROUP;
  const { visible } = useModal(modalId);

  const router = useCustomRouter();

  const {
    filter,
    filterContentList,
    filterDropdownList,
    hasSearched,
    isLoading,
    page,
    selected,
    tableHeader,
    setFilter,
    setPage,
    setPageSize,
    listMasterDebtor,
    totalPage,
  } = useModalGroup();

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
      {hasSearched ? (
        <Button
          disabled={isLoading || !!selected.length}
          sx={{ mr: 1 }}
          onClick={() => {
            setState({
              ...state,
              existingDebtorId: null,
              isExistingDebtor: false,
            });
            router.push(pipeline.NEW_PAGE);
            closeNiceModal(modalId);
          }}
        >
          Create New Group
        </Button>
      ) : null}
      <Button
        disabled={isLoading || !selected.length}
        onClick={() => {
          setState({
            ...state,
            existingDebtorId: selected[0]?.debtorId,
            isExistingDebtor: true,
          });
          router.push(pipeline.NEW_PAGE);
          closeNiceModal(modalId);
        }}
      >
        Add E
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        maxHeight: '75vh',
        maxWidth: '75vw',
        minWidth: '75vw',
      }}
      customFooter={footer}
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
        isPaper
        isLoading={isLoading}
        maxHeight="23.5vw"
        tableHeader={tableHeader}
        tableData={listMasterDebtor}
        totalPage={totalPage}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </SectionModal>
  );
});


export default ModalGroup;
