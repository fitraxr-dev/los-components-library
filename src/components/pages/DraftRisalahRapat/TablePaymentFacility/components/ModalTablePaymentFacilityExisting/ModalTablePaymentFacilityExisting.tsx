'use client';

import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetParameterListByModule from '@/hooks/services/useGetParameterListByModule';

import BaseContainer from '@/components/shared/BaseContainer';
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
    visible,
    modalId,
    pageNo,
    selected,
    tableHeader,
    popupFormFacilityHandler,
    setFilter,
    setPageNo,
    filter,
    setPageSize,
    syncTemenos,
    syncArium,
    handleModalClose,
  } = useModalTablePaymentFacilityExisting();

  const [productModule, setProductModule] = useState(null);


  const { data: productList } = useGetParameterListByModule(productModule);
  const { data: financingSegmentList } = useGetParameterList(Modules.FINANCING_SEGMENT, { label: 'value1', value: 'key' });
  const { data: searchByOptions } = useGetParameterList(Modules.SEARCH_BY_FACILITY_EXISTING, { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList(Modules.SORT_BY_FACILITY_EXISTING_DATA, { label: 'value1', value: 'value2' });
  const { data: collectabilityList } = useGetParameterList(Modules.COLLECTIBILITY, { label: 'value1', value: 'key' });

  const filterCollectability = collectabilityList.map((dt) => {
    return {
      label: `KOL - ${dt.label}`,
      value: dt.value,
    };
  });

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions ?? [],
      type: 'sort',
    },
    {
      key: 'financingFacility',
      label: 'Segment Pembiayaan',
      options: financingSegmentList || [],
      type: 'multiple-autocomplete',
      watch: (val) => {
        if (Array.isArray(val) && !val.length) {
          setProductModule(null);
        } else {
          setProductModule(val);
        }
      },
    },
    {
      isDisabled: !productModule,
      key: 'product',
      label: 'Produk',
      options: productList || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'collectability',
      label: 'Kolektibilitas',
      options: filterCollectability || [],
      type: 'multiple-autocomplete',
    },
  ];

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
          onClick={syncTemenos}
        >
          Sync Temenos
        </Button>
        <Button
          variant="outlined"
          startIcon="sync"
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
          totalPage={dataPaymentFacilityExisting?.page?.totalPage}
        />
      </BaseContainer>

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
