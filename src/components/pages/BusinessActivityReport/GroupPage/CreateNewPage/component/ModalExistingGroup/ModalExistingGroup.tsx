'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';


import { modal } from './ModalExistingGroup.constant';
import { useModalExistingGroup } from './ModalExistingGroup.hook';

import type { ModalExistingGroupProps } from './ModalExistingGroup.type';


const ModalExistingGroup = NiceModal.create((props: ModalExistingGroupProps) => {
  const modalId = modal.EXISTING_GROUP;
  const { visible } = useModal(modalId);

  const {
    handleCreateNewGroup,
    selected,
    tableHeader,
    handleCreateBarWithExisting,
    isLoading,
    listMasterGroup,
    totalPage,
    page,
    setPage,
    setPageSize,
  } = useModalExistingGroup(props);

  const footer = (
    <RowWrapper sx={{ gap: '24px', justifyContent: 'end', mt: 2 }}>
      <Button
        disabled={selected.length > 0}
        onClick={handleCreateNewGroup}
      >
        Create New Group
      </Button>
      <Button
        disabled={selected.length < 1}
        onClick={handleCreateBarWithExisting}
      >
        Add Member
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        maxHeight: '90vh',
        maxWidth: '75vw',
        minWidth: '75vw',
      }}
      customFooter={footer}
      title="Rekomendasi Group"
    >
      <Table
        isPaper
        isLoading={isLoading}
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
