'use client';
import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { mip, analyst } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/bucket/useGetBucketList';
import useGetParameterList from '@/hooks/services/parameter/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import { reducer } from '@/components/layouts/AppLayout/App.constants';

import { TABLE_HEADER, TABLE_HEADER_ANALYST } from './List.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const [state, dispatch] = useApp();
  const router = useCustomRouter();
  const pathname = usePathname();
  const { recordActivity } = useRecordLog();

  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const isAnalyst = pathname === analyst.LIST_PAGE;

  // --- PARAMETER ---
  // Get MIP status filter options
  const { data: mipStatusOptions } = useGetParameterList(isAnalyst ? 'analystStatusFilter' : 'mipStatusFilter');
  const divisionOptions = useGetParameterList('division');

  // Get MIP search by options
  const { data: searchByOptions } = useGetParameterList('searchByMip', {
    label: 'value1',
    value: 'value2',
  });

  // Get MIP sort by options
  const { data: sortByOptions } = useGetParameterList('sortByMip', {
    label: 'value1',
    value: 'value2',
  });

  // Get mip list
  const { data, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: isAnalyst ? TypeModule.MIP : `${TypeModule.MIP}|${TypeModule.MIP_REVIEW}`,
      process: isAnalyst ? TypeProcess.MIP_ANALYST :
        `${TypeProcess.MIP}|${TypeProcess.MIP_REVIEW}|${TypeProcess.MIP_REVIEW_REVISION}`,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const listContents = data?.contents?.map((item) => ({
    ...item,
    aging: item.aging ?? '-',
    bucketProcessId: item.bucketProcessId || '-',
    cif: item.cif ?? '-',
    customerName: item.debtorName || '-',
    division: item.division || '-',
    institutionType: item.institutionTypeLabel || '-',
    totalProposal: item.totalProposal || '-',
  }));

  const listPage = data?.page;

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const tableHeader: TableHeader[] = [
    ...(isAnalyst ? TABLE_HEADER_ANALYST : TABLE_HEADER),
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {

            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: data.bucketProcessId,
              changeAfter: '',
              changeBefore: '',
              menuCode: 'mip',
              module: state.pages?.mipModule,
              process: state.pages?.mipProcess,
              remarks: `view detail ${state.pages?.mipModule}`,
            });

            dispatch({
              data: {
                ...state.pages,
                debtorId: data.debtorId,
                lastPath: pathname,
                mipModule: data.module,
                mipProcess: data.process,
              },
              type: reducer.SET_PAGES,
            });
            if (data.status.includes('MEMO_SUPP') && data.status !== 'MEMO_SUPPLEMENT_COMPLETED') {
              router.push(
                replacePath(
                  mip.MEMO_SUPPLEMENT_PAGE,
                  {
                    processId: data.bucketProcessId,
                  },
                ),
              );
            } else if (data.status === 'REVISION' || data.status === 'REVISION_RETURN_STAFF' || data.status === 'REVISION_RETURN_TL' || data.status === 'REVISION_WAITING_TL' || data.status === 'REVISION_WAITING_KADIV') {
              router.push(
                replacePath(
                  mip.MIP_REVIEW_REVISION_PAGE,
                  {
                    processId: data.bucketProcessId,
                  },
                ),
              );
            } else {
              const isAnalyst = pathname === analyst.LIST_PAGE;
              router.push(
                replacePath(
                  isAnalyst ? analyst.DEBTOR_INFORMATION_PAGE : mip.CUSTOMER_INFORMATION_PAGE,
                  {
                    processId: data.bucketProcessId,
                  },
                ),
              );
            }
          },
        },
      ],
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      allowFutureDates: true,
      endKey: 'endDueDate',
      label: 'Due Date',
      startKey: 'startDueDate',
      type: 'period',
    },
    {
      endKey: 'endAging',
      label: 'Aging',
      startKey: 'startAging',
      type: 'textPeriod',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionOptions.data,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: mipStatusOptions,
      type: 'multiple-autocomplete',
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    isAnalyst,
    isLoading,
    listContents,
    listPage,
    page,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};
