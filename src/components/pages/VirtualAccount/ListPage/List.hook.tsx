'use client';

import { useEffect, useState } from 'react';

import { virtualAccount, accessid } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';

import { useVirtualAccountContext } from '@/components/layouts/VirtualAccountLayout/VirtualAccount.context';
import Button from '@/components/shared/Button';
import PICRenderer from '@/components/shared/SmiSection/PICRenderer';
import TextStyle from '@/components/shared/TextStyle';

import useGetBucketListStatus from '../../UserManagement/UserList/hooks/useGetBucketListStatus';
import { FILTER_DIVISION_OPTIONS, FILTER_GAM_OPTIONS, FILTER_OPTIONS, SORT_OPTIONS } from '../__mocks__/mockData';
import useGetBucketList from '../hooks/useGetBucketList';
import useGetGamList from '../hooks/useGetGamList';
import useGetParameterListVa from '../hooks/useGetParameterListVa';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useList = () => {
  const router = useCustomRouter();
  const [filter, setFilter] = useState(null);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const { isStaff, isSuperAdmin, isStaffDkhi, isTL, isMaker, isChecker, isTaskForce } = useVirtualAccountContext();
  const canViewVa = useCheckAccess(accessid.VIRTUAL_ACCOUNT_VIEW);
  const { recordActivity } = useRecordLog();


  // useEffect(() => {
  //   setPage(1);
  // }, [filter]);

  const { data: sortByOptions } = useGetParameterListVa('sortByBucketVA');
  const { data: searchByOptions } = useGetParameterListVa('searchByBucketVA ');


  const { data: gamList } = useGetGamList();
  const gamListOptions = gamList?.map((item: any) => ({
    label: item.label,
    value: item.key,
  })) || [];

  const { data: statusData } = useGetBucketListStatus({
    module: TypeModule.VA_CREATION,
    process: TypeProcess.VA_CREATION,
  });

  const statusByOptions = statusData?.map((item: any) => ({
    label: item.label,
    value: item.key,
  })) || [];

  const { data: vaList, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      // status: filter?.filter?.status ? filter?.filter?.status?.map((value) => Number(value)) : [],
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  useEffect(() => {
    if (vaList) {
      recordActivity({
        activity: ActivityType.VIEW,
        module: TypeModule.VA_CREATION,
        process: TypeProcess.VA_CREATION,
        remarks: 'view virtual account list creation',
      });
    }
  }, [vaList, recordActivity]);

  const tablePage = vaList?.page;


  const tableData = vaList?.contents.map((data) => ({
    ...data,
    cif: data.cif ?? '-',
    createdDate: data.createdDate ?? '-',
    customerName: data.customerName ?? '-',
    gam: data.gam ?? '-',
    statusActivation: data.statusActivation ?? '-',
    statusLabel: data.statusLabel ?? '-',

  }));

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '1vw' },
      type: 'index',
    },
    {
      key: 'customerId',
      label: 'Customer ID',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'cif',
      label: 'CIF',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'customerName',
      label: 'Nama Customer',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'gam',
      label: 'GAM',
      sx: { minWidth: '8vw' },
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      render: (row) => (
        <TextStyle variant="body4">
          {row.createdDate ? `${formatDateTime(row.createdDate)}` : '-'}
        </TextStyle>
      ),
      sx: { minWidth: '10vw' },
    },
    ...(isTL || isStaff ? [{
      key: 'pic',
      label: 'PIC',
      sx: { minWidth: '10vw' },
    }] : []),
    ...(isStaff && isSuperAdmin || isStaff && isStaffDkhi ? [{
      key: 'statusLabel',
      label: 'Status',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          color="primary"
          noClick
        >
          {row.statusLabel}
        </Button>
      ),
    }] : []),

    {
      key: 'action',
      label: 'Action',
      options: [
        ...(canViewVa ? [{
          iconName: 'detail',
          onClick: (data) => {
            const nextPath = replacePath(virtualAccount.VA_DETAIL_CUSTOMER,
              { processId: `${data?.customerId}~${data?.bucketProcessId ?? 'VA-ID'}~VL` });
            // { processId: data.bucketProcessId });

            router.push(nextPath);
          },
        }] : [])

      ],
      sx: { minWidth: '6vw' },
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions ?? [],
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'gam',
      label: 'GAM',
      options: gamListOptions,
      type: 'multiple-autocomplete',
    },
    // {
    //   key: 'status',
    //   label: 'Status',
    //   options: statusByOptions,
    //   type: 'multiple-autocomplete',
    // },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    isChecker,
    isLoading, isMaker,
    isStaff,
    isStaffDkhi,
    isSuperAdmin,
    isTL,
    isTaskForce,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
  };
};

export default useList;
