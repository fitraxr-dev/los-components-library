import React, { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatCurrencyID } from '@/helpers/formatCurrency';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';


import useGetModalChildLimit from '../../../../hooks/useGetModalChildLimitSyariah';
import useSaveModalChildLimitSyariah from '../../../../hooks/useSaveModalChildLimitSyariah';
import useTableDebtorInformationLocal from '../../../TableDebtorInformationLocal/TableDebtorInformationLocal.hook';

import { childModalTableList } from './AddChildLimitModal.contants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useAddChildLimitModal = () => {
  const [filter, setFilter] = useSessionStorage('filter-add-child-limit-modal', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const { processId } = useIdentity();
  const pathname = usePathname();
  const pathArray = pathname.split('/');
  const facilityIdIndex = pathArray[7];
  const isDetail = pathArray[8]?.includes('detail');
  const queryClient = useQueryClient();
  const isHidden: boolean = processId?.includes('DEBT');
  const { recordActivity } = useRecordLog();
  const canCreateChildLimit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_CREATE);

  const currentSyariahFacilityId = typeof window !== 'undefined'
    ? sessionStorage.getItem('currentSyariahFacilityId')
    : null;

  const effectiveParentFacilityId = facilityIdIndex === 'add'
    ? currentSyariahFacilityId
    : facilityIdIndex;

  const { data: searchByOptions } = useGetParameterList('searchByFacilityUsulanSubmitList', {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByFacilityUsulanSubmitList', {
    label: 'value1',
    value: 'value2',
  });
  const { data: orderTypeOptions } = useGetParameterList('orderType');
  const { data: mappingOrderTypeOptions } = useGetParameterList('mappingOrderType');
  const { data: coreMappingOptions } = useGetParameterList('financingSegment');
  const { data: productOptions } = useGetParameterList('productSyariah');

  const { debtorData } = useTableDebtorInformationLocal();

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  });
  const { mutate: saveMutate, isPending: isSaving } = useSaveModalChildLimitSyariah();

  const { data, isLoading, isFetching } = useGetModalChildLimit({
    filter: {
      ...filter?.filter,
      ...(isHidden
        ? { debtorId: String(processId) }
        : { bucketProcessId: String(processId) }
      ),
      parentFacilityId: effectiveParentFacilityId,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });


  React.useEffect(() => {
    if (!isLoading && !isFetching) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'open add child limit modal',
      });
    }
  }, [isLoading, isFetching, processId, recordActivity]);

  const processList = data?.contents?.map((item, index) => {
    const numericValue = item.orderValue || 0;
    const currencyValue = item.currencyOrderValue || '';

    return {
      ...item,
      orderValue: `${currencyValue} ${formatCurrencyID(numericValue)}`,
    };
  });
  const processPage = data?.page;

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions || [],
      type: 'sort',
    },
    {
      key: 'orderTypes',
      label: 'Order Type',
      options: orderTypeOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'mappingOrderTypes',
      label: 'Mapping Order Type',
      options: mappingOrderTypeOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'mappingFinancingSegments',
      label: 'Segmen Pembiayaan',
      options: coreMappingOptions || [],
      type: 'multiple-autocomplete',
    },
    {
      key: 'products',
      label: 'Produk',
      options: productOptions || [],
      type: 'multiple-autocomplete',
    },
  ];

  const handleSave = () => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      changeBefore: JSON.stringify({
        parentFacilityId: effectiveParentFacilityId,
        selectedFacilities,
      }),
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'initiate save child limit selection',
    });

    const payload = {
      bucketProcessId: processId,
      facilityIds: Array.from(selectedFacilities),
      parentFacilityId: effectiveParentFacilityId,
    };

    saveMutate(payload, {
      onError: (error: any) => {
        const messageError = error?.message || '';

        recordActivity({
          activity: ActivityType.ADD,
          bucketProcessId: processId,
          module: TypeModule.MAINTENANCE_DATA,
          process: TypeProcess.MAINTENANCE_CUSTOMER,
          remarks: `save child limit failed: ${messageError}`,
        });

        showNiceModalV2({
          title: messageError,
          type: 'error',
        });
      },
      onSuccess: (response) => {

        recordActivity({
          activity: ActivityType.ADD,
          bucketProcessId: processId,
          changeAfter: JSON.stringify({
            payload,
            response,
          }),
          module: TypeModule.MAINTENANCE_DATA,
          process: TypeProcess.MAINTENANCE_CUSTOMER,
          remarks: `add ${selectedFacilities.length} child limit(s) to parent facility`,
        });

        showNiceModalV2({
          title: 'Data Child Limit berhasil disimpan',
          type: 'success',
        });
        if (response?.data) {
          sessionStorage.setItem('currentSyariahFacilityId', String(response.data.facilityId));
          sessionStorage.setItem('currentSyariahLimitId', String(response.data.syariahLimitId));
        }
        queryClient.invalidateQueries({ queryKey: ['child-limit-syariah-list']});
        closeNiceModal(MODAL.MAINTENANCE_DATA.ADD_ADD_CHILD_LIMIT);
      },
    });
  };

  const handleSelectDocument = (rowData: any) => {
    const facilityId = rowData.facilityId || rowData.id;
    const rowCurrency = rowData.currencyOrderValue || rowData.currency;

    if (!facilityId) return;

    const newSelectedFacilities = [...selectedFacilities];
    const index = newSelectedFacilities.indexOf(facilityId);

    const wasSelected = index > -1;

    if (wasSelected) {
      newSelectedFacilities.splice(index, 1);
      if (newSelectedFacilities.length === 0) {
        setSelectedCurrency(null);
      }
    } else {
      newSelectedFacilities.push(facilityId);
      if (newSelectedFacilities.length === 1) {
        setSelectedCurrency(rowCurrency);
      }
    }

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: wasSelected
        ? `deselect child limit facility ID: ${facilityId}`
        : `select child limit facility ID: ${facilityId}`,
    });

    setSelectedFacilities(newSelectedFacilities);
  };

  const tableHeader: TableHeader[] = [
    {
      isDisabled: (row) => {
        const rowCurrency = row.currencyOrderValue || row.currency;
        if (selectedFacilities.length === 0) return false;

        if (selectedCurrency) {
          return rowCurrency !== selectedCurrency;
        }

        return false;
      },
      isSelected: (row) => {
        const facilityId = row.facilityId || row.id;
        return facilityId ? selectedFacilities.includes(facilityId) : false;
      },
      key: 'checkbox',
      onSelectChange: (row) => {
        handleSelectDocument(row);
      },
      sx: { width: '4%' },
      type: 'checkbox' as const,
    },
    ...childModalTableList,
  ];

  return {
    canCreateChildLimit,
    currentSyariahFacilityId,
    effectiveParentFacilityId,
    filter,
    filterContentList,
    filterDropdownList,
    handleSave,
    isDetail,
    isHidden,
    isLoading,
    isSaving,
    page,
    pageSize,
    processList,
    processPage,
    selectedFacilities,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};

export default useAddChildLimitModal;
