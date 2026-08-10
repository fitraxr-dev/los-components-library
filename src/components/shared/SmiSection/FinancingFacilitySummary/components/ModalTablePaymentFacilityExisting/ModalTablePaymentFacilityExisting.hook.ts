import { useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';

import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useGetParameterListByModule from '@/hooks/services/useGetParameterListByModule';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetListFinancingFacilityExisting from '@/components/pages/MIP/FinancingOverviewPage/hooks/useGetListFinancingFacilityExisting';

import { modal } from '../../FinancingOverview.constants';

import { TABLE_PAYMENT_FACILITY_EXISTING } from './ModalTablePaymentFacilityExisting.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useModalTablePaymentFacilityExisting = () => {
  const { debtorId, setFacilityId, processId } = useIdentity();

  const [filter, setFilter] = useSessionStorage('filter-component-paymentfacility-table', null);
  const [selected, setSelected] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [productModule, setProductModule] = useState([]);

  const modalId = modal.TABLE_PAYMENT_FACILITY_EXISTING;
  const { visible } = useModal(modalId);

  const { data: productList } = useGetParameterListByModule(productModule);
  const { data: financingSegmentList } = useGetParameterList(Modules.FINANCING_SEGMENT, { label: 'value1', value: 'value2' });
  const { data: searchByOptions } = useGetParameterList(Modules.SEARCH_BY_FACILITY_EXISTING, { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList(Modules.SORT_BY_FACILITY_EXISTING_DATA, { label: 'value1', value: 'value2' });
  const { data: collectabilityList } = useGetParameterList('collectability', { label: 'value1', value: 'value2' });

  const payload = {
    filter: {
      ...filter?.filter,
      debtorId,
    },
    page: {
      itemPerPage: pageSize,
      noPage: pageNo,
    },
    searchDetail: filter?.searchDetail,
    sortList: filter?.sortList,
  };

  const { data: dataPaymentFacilityExisting } = useGetListFinancingFacilityExisting(payload);

  const tableHeader: Array<TableHeader> = [
    {
      isDisabled: () => false,
      isSelected: (data) => selected.some((el) => el.id === data.id),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected.some((el) => el.id === data.id)) {
          setSelected([]);
        } else {
          setSelected([data]);
        }
      },
      type: 'checkbox',
    },
    ...TABLE_PAYMENT_FACILITY_EXISTING
  ];


  const popupFormFacilityHandler = () => {
    const facilityId = selected[0]?.facilityId;
    const id = selected[0]?.id;
    setFacilityId(facilityId);
    NiceModal.show(modal.FORM_FACILITY, { existing: true, id });
    closeNiceModal(modalId);
  };

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
      label: 'Kolektabilitas',
      options: collectabilityList || [],
      type: 'multiple-autocomplete',
    },
  ];

  return {
    dataPaymentFacilityExisting,
    filter,
    filterContentList,
    modalId,
    pageNo,
    pageSize,
    popupFormFacilityHandler,
    searchByOptions,
    selected,
    setFilter,
    setPageNo,
    setPageSize,
    tableHeader,
    visible,
  };
};

export default useModalTablePaymentFacilityExisting;
