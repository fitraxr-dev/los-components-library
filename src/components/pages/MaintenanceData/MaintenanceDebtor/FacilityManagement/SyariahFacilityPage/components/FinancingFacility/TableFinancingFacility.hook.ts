import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { accessid, maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatCurrencyID } from '@/helpers/formatCurrency';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetListFinancingFacilitySyariah from '../../hooks/useGetListFinancingFacilitySyariah';
import useProposedFacilityTab from '../ProposedFacilityTab/ProposedFacilityTab.hook';
import useTableDebtorInformationLocal from '../TableDebtorInformationLocal/TableDebtorInformationLocal.hook';

import { financingFacilityHeaderList } from './TableFinancingFacility.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useFinancingFacility = () => {
  const [filter, setFilter] = useSessionStorage('filter-financing-facility', null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pathname = usePathname();
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const pathArray = pathname.split('/');
  const moduleIndex = pathArray[3];
  const processIdIndex = pathArray[4];
  const isHidden: boolean = processId?.includes('DEBT');
  const [{ stepper }] = useApp();
  const isViewOnly = !stepper.steps
    .flatMap((step) => [step, ...(step.childrenSteps ?? [])])
    .find((step) => step.urlPath === 'facility-syariah')?.enable;
  const { data: searchByOptions } = useGetParameterList('searchByFacilityUsulanSubmitList', {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByFacilityUsulanSubmitList ', {
    label: 'value1',
    value: 'value2',
  });
  const { data: orderTypeOptions } = useGetParameterList('orderType');
  const { data: mappingOrderTypeOptions } = useGetParameterList('mappingOrderType');
  const { data: coreMappingOptions } = useGetParameterList('financingSegment');
  const { data: productOptions } = useGetParameterList('productSyariah');
  const { clearSessionStorage } = useProposedFacilityTab();
  const { recordActivity } = useRecordLog();
  const canEdit = useCheckAccess(accessid.MAINTENANCE_DEBTOR_UPDATE);

  const { debtorData } = useTableDebtorInformationLocal();

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  });
  const debtorId = isHidden ? debtorData?.debtorId : debtorInfoData?.debtorId;

  const { data, isLoading } = useGetListFinancingFacilitySyariah({
    filter: {
      ...filter?.filter,
      ...(isHidden
        ? { debtorId: String(processId) }
        : { bucketProcessId: String(processId) }
      ),
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  }, {
    enabled: Boolean(debtorId),
  });

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
      label: 'CORE Mapping Segmen Pembiayaan',
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
  useEffect(() => {
    clearSessionStorage();
  }, []);

  useEffect(() => {
    if (data && !isLoading) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'view financing facility syariah list page',
      });
    }
  }, [data, isLoading, processId, recordActivity]);

  const handleDetail = (row) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view detail financing facility syariah',
    });
    if (typeof window !== 'undefined' && row?.id) {
      sessionStorage.setItem('currentIdDetailFacility', row?.id);
    }
    router.push(replacePath(maintenanceDebtor.DETAIL_FACILITY, {
      id: row?.facilityId,
      module: moduleIndex,
      processId: processIdIndex,
    }) + '?menu=child-limit');
  };

  const handleEdit = (row) => {
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId,
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'navigate to edit financing facility syariah',
    });
    if (typeof window !== 'undefined' && row?.id) {
      sessionStorage.setItem('currentIdDetailFacility', row?.id);
    }
    const isNewFromExisting = row?.orderType === 'New From Existing';
    router.push(replacePath(maintenanceDebtor.EDIT_FACILITY, {
      id: row?.facilityId,
      module: moduleIndex,
      processId: processIdIndex,
    }) + `?menu=child-limit${isNewFromExisting ? '&newFromExisting=true' : ''}`);
  };

  const handleLimitInduk = (row) => {
    if (typeof window !== 'undefined' && row?.syariahLimitId) {
      sessionStorage.setItem('currentSyariahLimitId', row?.syariahLimitId);
    }
    sessionStorage.setItem('currentIdLimitInduk', row?.parentFacilityId);
    const type = isHidden ? 'detail' : 'edit';
    router.push(replacePath(`${pathname}/${row?.parentFacilityId}/${type}/limit-induk`, { processId }));
  };

  const tableHeader: TableHeader[] = [
    ...financingFacilityHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (row) => handleDetail(row),
        },
        {
          iconName: 'edit',
          isDisabled: isViewOnly || !canEdit,
          isHidden: isHidden,
          onClick: (row) => handleEdit(row),
        },
        {
          iconName: 'lps',
          isHidden: (row) => !row?.hasParent,
          onClick: (row) => handleLimitInduk(row),
        },
      ],
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    }
  ];

  const anomalyRow = (val: any) => {
    if (val.hasDelta === true)
      return { bgcolor: 'rgba(235, 87, 87, 0.2)' };
  };

  return {
    anomalyRow,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    pageSize,
    processList,
    processPage,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};

export default useFinancingFacility;
