'use client';
import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import useModalTablePaymentFacilityExisting from './ModalTablePaymentFacilityExisting.hook';


const ModalTablePaymentFacilityExisting = NiceModal.create(() => {
  const theme = useTheme();

  const {
    dataPaymentFacilityExisting,
    modal,
    modalId,
    noPage,
    selected,
    tableHeader,
    popupFormFacilityHandler,
    setFilter,
    setNoPage,
    setPageSize,
    searchByOptions,
    filterContentList,
  } = useModalTablePaymentFacilityExisting();


  return (
    <SectionModal
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        maxHeight: '80vh',
        minWidth: '70vw',
        padding: theme.spacing(2),
      }}
    >
      <Input
        type="search"
        onChange={(val) => setFilter(val)}
        dropdownList={searchByOptions ?? []}
        contentList={filterContentList}
      />
      <Table
        maxHeight="45vh"
        tableHeader={tableHeader}
        tableData={dataPaymentFacilityExisting?.contents || []}
        currentPage={noPage}
        handlePageChange={setNoPage}
        onPageSizeChange={setPageSize}
        totalPage={dataPaymentFacilityExisting?.page?.totalPage ?? 1}
      />
      <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
        <Button
          disabled={!selected?.length}
          onClick={() => popupFormFacilityHandler()}
        >
          Add New
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});


export default ModalTablePaymentFacilityExisting;
