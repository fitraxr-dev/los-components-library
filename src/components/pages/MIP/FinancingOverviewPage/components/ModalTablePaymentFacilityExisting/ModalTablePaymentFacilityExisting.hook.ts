import { useState } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';

import Modules from '@/enums/Modules';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useGetParameterListByModule from '@/hooks/services/useGetParameterListByModule';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import { modal as modalMip } from '../../FinancingOverview.constants';
import useGetListFinancingFacilityExisting from '../../hooks/useGetListFinancingFacilityExisting';

import { TABLE_PAYMENT_FACILITY_EXISTING } from './ModalTablePaymentFacilityExisting.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const usePopupTablePaymentFacilityExisting = () => {
  const { debtorId, setFacilityId } = useIdentity();

  const [filter, setFilter] = useState(null);
  const [selected, setSelected] = useState([]);
  const [noPage, setNoPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [productModule, setProductModule] = useState([]);

  const modalId = modalMip.TABLE_PAYMENT_FACILITY_EXISTING;
  const modal = useModal(modalId);
  const onSuccess = modal.args?.onSuccess;

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
      noPage: noPage,
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

    NiceModal.show(modalMip.FORM_FACILITY, {
      existing: true,
      id,
      onSuccess,
    });
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
    filterContentList,
    modal,
    modalId,
    noPage,
    popupFormFacilityHandler,
    searchByOptions,
    selected,
    setFilter,
    setNoPage,
    setPageSize,
    tableHeader,
  };
};

export default usePopupTablePaymentFacilityExisting;
