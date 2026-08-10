import { useState } from 'react';


import NiceModal, { useModal } from '@ebay/nice-modal-react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import showNiceModal from '@/helpers/showNiceModal';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetParameterListByModule from '@/hooks/services/useGetParameterListByModule';
import useSyncAriumHook from '@/hooks/services/useSyncArium';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';
import useViewOnly from '@/hooks/useViewOnly';

import useGetPaymentFacilityAllExisting from '../../hooks/useGetFinancingFacilityAllExisting';
import useGetFinancingFacilityByPipelineId from '../../hooks/useGetFinancingFacilityByPipelineId';
import useGetMasterDebtorDetail from '../../hooks/useGetMasterDebtorDetail';
import useSyncTemenosHook from '../../hooks/useSyncTemenos';
import { modal } from '../../TablePaymentFacility.constants';

import { TABLE_PAYMENT_FACILITY_EXISTING } from './ModalTablePaymentFacilityExisting.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


interface UseModalTablePaymentFacilityExistingProps {
  module?: string;
  process?: string;
}

const useModalTablePaymentFacilityExisting = (props?: UseModalTablePaymentFacilityExistingProps) => {
  const { processId, debtorId, setFacilityId } = useIdentity();

  const moduleValue = props?.module;
  const processValue = props?.process;

  const [filter, setFilter] = useState({});
  const [selected, setSelected] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [productModule, setProductModule] = useState(null);

  const modalId = modal.TABLE_PAYMENT_FACILITY_EXISTING;
  const { visible } = useModal(modalId);

  const { data: financingSegmentListTemp } = useGetParameterList(Modules.FINANCING_SEGMENT, { key: 'key', label: 'value1', value: 'value2' });

  const financingSegmentList = financingSegmentListTemp;

  const convertFilter = () => {
    const filterTemp = filter?.filter;
    const product = filterTemp?.product?.join('|');
    const financingSegment = filterTemp?.financingSegment && filterTemp?.financingSegment?.length && financingSegmentListTemp?.filter((item) => filterTemp?.financingSegment?.includes(item.value))?.map((item) => item.key)?.join('|');
    const collectability = filterTemp?.collectability?.join('|');
    return {
      collectability,
      financingSegment,
      product,
    };
  };

  const payload = {
    filter: {
      ...filter?.filter,
      ...convertFilter(),
      bucketProcessId: processId,
      debtorId,
      module: moduleValue,
      process: processValue,
    },
    page: {
      itemPerPage: pageSize,
      noPage: pageNo,
    },
    searchDetail: filter?.searchDetail,
    sortList: filter?.sortList,
  };

  const { data: dataPaymentFacilityExisting, refetch } = useGetPaymentFacilityAllExisting(payload);

  const { data: currentFacilitiesData } = useGetFinancingFacilityByPipelineId({
    filter: {
      bucketProcessId: processId,
      module: moduleValue,
      process: processValue,
    },
    page: {
      itemPerPage: 1000,
      noPage: 1,
    },
  });

  const { data: debtorDetail } = useGetMasterDebtorDetail({
    debtorId: String(debtorId),
  });

  const { syncTemenos: syncTemenosHookFn } = useSyncTemenosHook(String(debtorId));
  const { mutateAsync: syncAriumHookFn } = useSyncAriumHook({});

  const { data: productList } = useGetParameterListByModule(productModule);
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
      key: 'financingSegment',
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

  const currentFacilities = currentFacilitiesData?.contents || [];
  const currentFacilityKeys = currentFacilities
    .filter((facility) => facility.orderType === 'EXISTING' || facility.orderType === 'New From Existing')
    .map((facility) => facility.coreFacilityId);

  const tableHeader: Array<TableHeader> = [
    {
      isDisabled: (data) => {
        const isDisabled = currentFacilityKeys.includes(data.coreFacilityId);
        return isDisabled;
      },
      isSelected: (data) => {
        const isDisabled = currentFacilityKeys.includes(data.coreFacilityId);

        if (isDisabled) {
          return true;
        }

        return selected.some((el) => el.id === data.id);
      },
      key: 'checkbox',
      onSelectChange: (data) => {
        if (currentFacilityKeys.includes(data.coreFacilityId)) {
          return;
        }
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
    NiceModal.show(modal.PAYMENT_FACILITY_FORM, {
      existing: true,
      id,
      module: moduleValue,
      process: processValue,
      type: 'existing',
    });
    closeNiceModal(modalId);
  };

  const handleModalClose = () => {
    setFacilityId('');
    closeNiceModal(modalId);
  };

  const syncTemenos = async () => {
    try {
      await syncTemenosHookFn();
      await refetch();
    } catch (error: any) {
      const message = error?.data?.errorDetail || error?.message || 'Terjadi kesalahan saat melakukan sync temenos';
      showNiceModal('error', message);
    }
  };

  const syncArium = async () => {
    try {
      await syncAriumHookFn({ cif: debtorDetail.cif });
      await refetch();
    } catch (error: any) {
      const message = error?.data?.errorDetail || error?.message || 'Terjadi kesalahan saat melakukan sync arium';
      showNiceModal('error', message);
    }
  };

  return {
    currentFacilityKeys,
    dataPaymentFacilityExisting,
    filter,
    filterContentList,
    handleModalClose,
    modalId,
    pageNo,
    pageSize,
    popupFormFacilityHandler,
    searchByOptions,
    selected,
    setFilter,
    setPageNo,
    setPageSize,
    syncArium,
    syncTemenos,
    tableHeader,
    visible,
  };
};

export default useModalTablePaymentFacilityExisting;
