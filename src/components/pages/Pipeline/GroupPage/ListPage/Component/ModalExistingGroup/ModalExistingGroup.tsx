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


import { useModalExistingGroup } from './ModalExistingGroup.hook';

import type { PipelineContextType } from '@/components/layouts/PipelineLayout/Pipeline.context';


const ModalExistingGroup = NiceModal.create(({
  state,
  setState,
}: PipelineContextType
) => {


  const {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    selected,
    tableHeader,
    setFilter,
    setPage,
    setPageSize,
    totalPage,
    listMasterGroup,
    handleCreateNewGroup,
    handleAddGroupMember,
    visible,
    modalId,
  } = useModalExistingGroup();

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
      <Button
        disabled={isLoading || selected.length > 0}
        sx={{ mr: 1 }}
        onClick={handleCreateNewGroup}
      >
        Create New Group
      </Button>
      <Button
        disabled={isLoading || selected.length < 1}
        onClick={handleAddGroupMember}
      >
        Add Group Member
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
        tableData={listMasterGroup}
        totalPage={totalPage}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </SectionModal>
  );
});


export default ModalExistingGroup;
