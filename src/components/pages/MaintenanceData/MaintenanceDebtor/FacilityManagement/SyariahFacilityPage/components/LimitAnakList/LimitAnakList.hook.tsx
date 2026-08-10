import { useEffect, useMemo, useState } from 'react';


import { useParams, usePathname, useRouter } from 'next/navigation';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { formatCurrency } from '@/helpers/formatCurrency';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import useGetDataAsOf from '../../hooks/useGetDataAsOf';
import useGetExistingFacilitySyariahLists from '../../hooks/useGetExistingFacilitySyariahList';

import { tableHeaderList } from './LimitAnakList.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useLimitAnakList = () => {
  const [{ stepper }] = useApp();
  const { recordActivity } = useRecordLog();
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const [filter, setFilter] = useSessionStorage('filter-list-limit-anak', null);
  const isViewOnly = !stepper.steps.find((step) => step.urlPath === 'facility-management')?.enable;
  const pathname = usePathname();
  const isMaster = pathname.split('/').includes('master');

  const router = useRouter();
  const params = useParams();

  const { id, idInduk, processId } = params;

  const isDebtor = processId?.includes('DEBT');

  // --- Parameter ---
  const { data: searchByOptions } = useGetParameterList('searchByListFinancingSyariahExisting', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByListFinancingSyariahExisting', { label: 'value1', value: 'value2' });

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Fasilitas Syariah', url: maintenanceDebtor.SYARIAH_FACILITY_PAGE.replace('[processId]', processId as string).replace('[module]', isMaster ? 'master' : 'maintenance') },
      { label: 'List Limit Anak', url: '' },
    ]);

    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'facility-syariah',
      module: TypeModule.MAINTENANCE_DEBTOR,
      process: TypeProcess.MAINTENANCE_DEBTOR,
      remarks: 'view list limit anak',
    });
  }, []);

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  }, { enabled: !isDebtor });

  const { data: dataAsOf } = useGetDataAsOf({
    debtorId: isDebtor ? processId as string : bucketDetail?.debtorId,
    parentFacilityId: idInduk as string,
  });

  const {
    data: childLimitList,
    isLoading: isLoadingchildLimitListList,
  } = useGetExistingFacilitySyariahLists({
    filter: {
      ...filter?.filter,
      debtorId: isDebtor ? processId as string : bucketDetail?.debtorId,
      parentFacilityId: idInduk as string,
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const childLimitListContents = childLimitList?.contents;
  const childLimitListPage = childLimitList?.page;

  const childLimitListData = useMemo(() => childLimitListContents?.map((item) => ({
    ...item,
    activationDate: item?.activationDate && formatDate(item?.activationDate),
    orderValue: item?.orderValue && formatCurrency(String(item?.orderValue)),
    outstanding: item?.outstanding && formatCurrency(String(item?.outstanding)),
  })), [childLimitList]);

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'facilityStatus',
      label: 'Status Fasilitas',
      sx: {
        minWidth: '10vw',
      },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: () => {router.push(replacePath(maintenanceDebtor.DETAIL_LIMIT_ANAK, {
            id,
            module: isMaster ? 'master' : 'maintenance',
            processId,
          }));},
        },
        {
          iconName: 'edit',
          isHidden: isViewOnly,
          onClick: () => {router.push(replacePath(maintenanceDebtor.EDIT_LIMIT_ANAK, {
            id,
            module: isMaster ? 'master' : 'maintenance',
            processId,
          }));},
        }
      ],
      sx: {
        minWidth: '6vw',
      },
      type: 'action',
    }
  ];

  const filterDropdownList = searchByOptions;

  const searchByList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDateAsOf',
      key: 'dateAsOf',
      label: 'Date As Of',
      placeholder1: 'Date',
      placeholder2: 'Date',
      startKey: 'startDateAsOf',
      type: 'period',
    },
  ];

  const filterList = [
    {
      label: 'Facility Id',
      value: 'm.facility_id',
    },
    {
      label: 'CIF',
      value: 'd.cif',
    },
    {
      label: 'Nama Customer',
      value: 'd.customer_name',
    }
  ];

  return {
    childLimitListContents,
    childLimitListData,
    childLimitListPage,
    dataAsOf,
    filter,
    filterDropdownList,
    filterList,
    isLoadingchildLimitListList,
    itemPerPage,
    noPage,
    searchByList,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
  };
};
export default useLimitAnakList;
