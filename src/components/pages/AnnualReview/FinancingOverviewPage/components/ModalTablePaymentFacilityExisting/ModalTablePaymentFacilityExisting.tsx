'use client';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import useModalTablePaymentFacilityExisting from './ModalTablePaymentFacilityExisting.hook';


interface ModalTablePaymentFacilityExistingProps {
  module?: string;
  process?: string;
}

const ModalTablePaymentFacilityExisting = NiceModal.create((props: ModalTablePaymentFacilityExistingProps) => {
  const theme = useTheme();

  const {
    dataPaymentFacilityExisting,
    visible,
    modalId,
    pageNo,
    selected,
    tableHeader,
    saveSelectedFacilities,
    isSaving,
    setFilter,
    setPageNo,
    filter,
    setPageSize,
    searchByOptions,
    filterContentList,
    syncTemenos,
    syncArium,
    isSyncingTemenos,
    isSyncingArium,
    handleModalClose,
  } = useModalTablePaymentFacilityExisting({
    module: props.module,
    process: props.process,
  });

  return (
    <SectionModal
      isOpen={visible}
      onClose={handleModalClose}
      customFooter={() => null}
      containerSx={{
        maxHeight: '80vh',
        minWidth: '70vw',
        padding: theme.spacing(2),
      }}
    >
      <Input
        type="search"
        value={filter}
        onChange={(val) => setFilter(val)}
        dropdownList={searchByOptions ?? []}
        contentList={filterContentList}
      />

      <RowWrapper sx={{ gap: 2, justifyContent: 'end' }}>
        <Button
          variant="outlined"
          startIcon="sync"
          isLoading={isSyncingTemenos}
          onClick={syncTemenos}
        >
          Sync Temenos
        </Button>
        <Button
          variant="outlined"
          startIcon="sync"
          isLoading={isSyncingArium}
          onClick={syncArium}
        >
          Sync Arium
        </Button>
      </RowWrapper>

      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          maxHeight="45vh"
          tableHeader={tableHeader}
          tableData={dataPaymentFacilityExisting?.contents || []}
          currentPage={pageNo}
          handlePageChange={setPageNo}
          onPageSizeChange={setPageSize}
          totalPage={dataPaymentFacilityExisting?.page?.totalPage ?? 1}
        />
      </BaseContainer>

      <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
        <Button
          disabled={!selected?.length}
          isLoading={isSaving}
          onClick={() => saveSelectedFacilities()}
        >
          Add New
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});


export default ModalTablePaymentFacilityExisting;
