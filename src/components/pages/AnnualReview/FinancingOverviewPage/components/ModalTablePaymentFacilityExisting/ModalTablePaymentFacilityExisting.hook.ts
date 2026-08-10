import { useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';

import { TypeModule } from '@/enums/Module';
import Modules from '@/enums/Modules';
import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useGetParameterListByModule from '@/hooks/services/useGetParameterListByModule';
import useSyncAriumHook from '@/hooks/services/useSyncArium';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetMasterDebtorDetail from '@/components/shared/SmiTable/TablePaymentFacility/hooks/useGetMasterDebtorDetail';
import useSyncTemenos from '@/components/shared/SmiTable/TablePaymentFacility/hooks/useSyncTemenos';

import useGetListFinancingFacilityExisting from '../../hooks/useGetListFinancingFacilityExisting';
import useSaveFinancingFacility from '../../hooks/useSaveFinancingFacility';


import { TABLE_PAYMENT_FACILITY_EXISTING } from './ModalTablePaymentFacilityExisting.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


interface UseModalTablePaymentFacilityExistingProps {
  module?: string;
  process?: string;
}

const useModalTablePaymentFacilityExisting = (props?: UseModalTablePaymentFacilityExistingProps) => {
  const { processId, debtorId } = useIdentity();
  const queryClient = useQueryClient();

  const moduleValue = props?.module || TypeModule.ANNUAL_REVIEW;
  const processValue = props?.process;

  const [filter, setFilter] = useState({});
  const [selected, setSelected] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [productModule, setProductModule] = useState(null);

  const modal = useModal();
  const modalId = modal.id;
  const visible = modal.visible;

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

  const { data: dataPaymentFacilityExisting, refetch } = useGetListFinancingFacilityExisting(payload);

  const { data: debtorDetail } = useGetMasterDebtorDetail({
    debtorId: String(debtorId),
  });

  const { syncTemenos: syncTemenosHookFn, isSyncing: isSyncingTemenos } = useSyncTemenos(String(debtorId));
  const { mutateAsync: syncAriumHookFn, isPending: isSyncingArium } = useSyncAriumHook({});

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

  const tableHeader: Array<TableHeader> = [
    {
      isSelected: (data) => {
        return selected.some((el) => el.id === data.id);
      },
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected.some((el) => el.id === data.id)) {
          setSelected(selected.filter((el) => el.id !== data.id));
        } else {
          setSelected([...selected, data]);
        }
      },
      type: 'checkbox',
    },
    ...TABLE_PAYMENT_FACILITY_EXISTING
  ];

  const { mutateAsync: saveFinancingFacility, isPending: isSaving } = useSaveFinancingFacility({});

  const saveSelectedFacilities = async () => {
    if (!selected.length) return;

    try {
      for (const facility of selected) {
        const payload = {
          attributes: facility.attributes || [],
          bucketProcessId: String(processId),
          currencyOrderValue: facility.currencyOrderValue,
          exchangeRate: facility.exchangeRate,
          facilityId: facility.facilityId,
          financingSegment: facility.financingSegment,
          id: null,
          module: moduleValue,
          orderType: 'New From Existing',
          orderValue: facility.orderValue?.replace(/,/g, ''),
          orderValueAfterExchangeRate: facility.orderValueAfterExchangeRate?.replace(/,/g, ''),
          process: processValue,
          product: facility.product,
          remark: facility.remark || '',
        };

        await new Promise<void>((resolve, reject) => {
          saveFinancingFacility(payload as any, {
            onError: () => reject(),
            onSuccess: () => resolve(),
          });
        });
      }

      closeNiceModal(modalId);
      setSelected([]);
      showNiceModalV2({
        title: 'Fasilitas pembiayaan berhasil ditambahkan',
        type: 'success',
      });
      queryClient.invalidateQueries({ queryKey: ['financing-facility-list']});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-all-existing']});
      queryClient.invalidateQueries({ queryKey: ['financing-facilities']});
    } catch {
      showNiceModalV2({
        title: 'Gagal menyimpan fasilitas pembiayaan',
        type: 'error',
      });
      queryClient.invalidateQueries({ queryKey: ['financing-facility-list']});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-all-existing']});
      queryClient.invalidateQueries({ queryKey: ['financing-facilities']});
    }
  };

  const handleModalClose = () => {
    setSelected([]);
    closeNiceModal(String(modalId));
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

  return {
    dataPaymentFacilityExisting,
    filter,
    filterContentList,
    handleModalClose,
    isSaving,
    isSyncingArium,
    isSyncingTemenos,
    modalId,
    pageNo,
    pageSize,
    saveSelectedFacilities,
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
