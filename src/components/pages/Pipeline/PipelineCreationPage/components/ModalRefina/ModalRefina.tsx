'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { useModalRefina } from './ModalRefina.hook';

import type { RefinaProps } from './ModalRefina.props';


const ModalRefina = NiceModal.create((props: RefinaProps) => {
  const modalId = MODAL.SYNC_WITH_REFINA;
  const { visible } = useModal(modalId);

  const {
    isLoading,
    page,
    selected,
    tableHeader,
    setPage,
    setPageSize,
    listMasterDebtor,
    handleSaveRefina,
    totalPage,
  } = useModalRefina({ ...props, modalId });

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>

      <RowWrapper sx={{ gap: 1 }}>
        <Button
          variant="outlined"
          disabled={isLoading || !!selected.length}
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>

        <Button
          disabled={isLoading || !selected.length}
          onClick={handleSaveRefina}
        >
          Save
        </Button>
      </RowWrapper>
    </RowWrapper >
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


export default ModalRefina;
