'use client';
import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetParameterListByModule from '@/hooks/services/useGetParameterListByModule';
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
    filter,
    dataPaymentFacilityExisting,
    modal,
    modalId,
    pageNo,
    selected,
    tableHeader,
    popupFormFacilityHandler,
    setFilter,
    setPageNo,
    setPageSize,
  } = useModalTablePaymentFacilityExisting();

  const [productModule, setProductModule] = useState([]);

  const { data: collectabilityList = []} = useGetParameterList(Modules.COLLECTIBILITY);
  const { data: productList } = useGetParameterListByModule(productModule);
  const { data: financingSegmentList } = useGetParameterList(Modules.FINANCING_SEGMENT, { label: 'value1', value: 'value2' });
  const { data: searchByOptions } = useGetParameterList(Modules.SEARCH_BY_FACILITY_EXISTING, { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList(Modules.SORT_BY_FACILITY_EXISTING_DATA, { label: 'value1', value: 'value2' });

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions ?? [],
      type: 'sort',
    },
    {
      key: 'financingFacility',
      label: 'Segmen Pembiayaan',
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
      key: 'collectivity',
      label: 'Kolektibilitas',
      options: collectabilityList || [],
      type: 'multiple-autocomplete',
    },
  ];

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
        value={filter}
        onChange={(val) => setFilter(val)}
        dropdownList={searchByOptions ?? []}
        contentList={filterContentList}
      />
      <Table
        maxHeight="45vh"
        tableHeader={tableHeader}
        tableData={dataPaymentFacilityExisting?.contents || []}
        currentPage={pageNo}
        handlePageChange={setPageNo}
        onPageSizeChange={setPageSize}
        totalPage={dataPaymentFacilityExisting?.page?.totalPage}
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
