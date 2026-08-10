'use client';
import NiceModal, { useModal, ModalDef } from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Search from '@/components/shared/Input/components/Search';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { MODAL_REFINA_DETAIL } from './ModalRefina.constants';
import { useModalRefina } from './ModalRefina.hook';
import ModalRefinaDetail from './ModalRefinaDetail';

import type { RefinaProps } from './ModalRefina.props';


const ModalRefina = NiceModal.create((props: RefinaProps) => {
  const modalId = MODAL.SYNC_WITH_REFINA;
  const { visible } = useModal(modalId);

  const {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    selected,
    tableHeader,
    setPage,
    setPageSize,
    listMasterDebtor,
    setFilter,
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

      {/* Modal Detail Refina */}
      <ModalDef
        id={MODAL_REFINA_DETAIL}
        component={ModalRefinaDetail}
      />
    </SectionModal>
  );
});


export default ModalRefina;
