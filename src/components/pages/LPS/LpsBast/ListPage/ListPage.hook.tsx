import React, { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { DPOP_DIVISION, roles } from '@/configs/constants';
import { loanProcessingSummary } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, toDateString } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useLpsBastContext } from '@/components/layouts/LpsLayoutBast/LpsLayoutBast.context';
import Button from '@/components/shared/Button';
import PICRenderer from '@/components/shared/SmiSection/PICRenderer';
import TextStyle from '@/components/shared/TextStyle';

import { TABLE_HEADER } from './ListPage.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useListPage = () => {
  const router = useCustomRouter();
  const [state] = useApp();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { divisionCode } = useDivision();
  const [filter, setFilter] = useSessionStorage('filter-component-delst', null);
  const path = usePathname();
  const { isDivisiBisnis } = useLpsBastContext();
  const pathModule = getLastPath(path);
  const currentRole = state?.currentRole || '';
  const paramFilterstatus = isDivisiBisnis ? 'filterStatusLPSBList' : 'filterStatusLPSBDList';
  const isDpop = divisionCode.includes(DPOP_DIVISION);
  const isMaker = currentRole?.includes('MAKER');
  const isChecker = currentRole?.includes('CHECKER');

  const { recordActivity } = useRecordLog();

  const { data, isLoading, isFetching } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.LPS,
      process: isMaker
        ? `${TypeProcess.LPS_BAST}|${TypeProcess.LPS_BAST_DPOP}`
        : isDivisiBisnis || isChecker
          ? TypeProcess.LPS_BAST
          : TypeProcess.LPS_BAST_DPOP,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const processList = data?.contents?.map((process) => ({
    ...process,
    additionalData: process.additionalData,
    aging: process.aging ?? '-',
  }));

  const processPage = data?.page;


  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    if (!isLoading && !isFetching) {
      recordActivity({
        activity: ActivityType.VIEW,
        module: TypeModule.LPS,
        process: isDivisiBisnis ? TypeProcess.LPS_BAST : TypeProcess.LPS_BAST_DPOP,
        remarks: 'view LPS BAST list page',
      });
    }
  }, [isLoading, isFetching, recordActivity, isDivisiBisnis]);

  const { watch, setValue, handleSubmit, formState: { isValid } } = useForm({
    defaultValues: {
      endDate: '',
      list: [],
      startDate: '',
    },
    mode: 'onChange',
  });

  /** Start Get Parameter List */
  const { data: statusOptions } = useGetParameterList(paramFilterstatus);
  const searchByParam = isDivisiBisnis ? 'searchByLPSBMonitoringList' : 'searchByLPSBDPOPList';
  const { data: searchByOptions } = useGetParameterList(searchByParam, {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByLPSBMonitoringList', {
    label: 'value1',
    value: 'value2',
  });
  const { data: divisionOptions } = useGetParameterList('division');
  /** End Get Parameter List */

  const isKadivTL = state.currentRole.includes(roles.KADIV)
    || state.currentRole.includes(roles.TL)
    || state.currentRole.includes(roles.TL_ANALYST);


  const tableHeader: Array<TableHeader> = [
    ...TABLE_HEADER,
    ...(isDpop ? [{
      key: 'pic',
      label: 'PIC',
      render: (row) => <PICRenderer data={row?.pic} />,
      sx: { minWidth: '10vw' },
    }] : []),
    {
      key: 'pkName',
      label: 'Nama PK',
      render: (row) => {
        const pkName = row?.additionalData?.pkName.split('-')[0] ?? '-';
        return <TextStyle variant="body4">{pkName}</TextStyle>;
      },
      sx: { minWidth: '10vw' },
    },
    {
      key: 'pkNumber',
      label: 'No PK/Adendum',
      render: (row) => {
        const pkNumber = row?.additionalData?.pkNumber ?? '-';
        return <TextStyle variant="body4">{pkNumber}</TextStyle>;
      },
      sx: { minWidth: '10vw' },
    },
    {
      key: 'pkDate',
      label: 'Tanggal PK/Adendum',
      render: (row) => {
        const pkDate = row?.additionalData?.effectiveDate ? toDateString(row?.additionalData?.effectiveDate) : '-';
        return <TextStyle variant="body4">{pkDate}</TextStyle>;
      },
      sx: { minWidth: '13vw' },
    },
    {
      key: 'modifiedAt',
      label: 'Created Date',
      render: (row) => React.createElement(TextStyle, { variant: 'body4' }, row.modifiedAt !== null ? formatDate(row.modifiedAt, 'DD MMM YYYY, HH:mm:ss') : formatDate(row.createdAt, 'DD MMM YYYY, HH:mm:ss')),
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    // {
    //   key: 'effectiveDate',
    //   label: 'Tanggal Efektif',
    //   render: (row) => {
    //     const effectiveDate =
    //        row?.additionalData?.effectiveDate ? toDateString(row?.additionalData?.effectiveDate) : '-';
    //     return <TextStyle variant="body4">{effectiveDate}</TextStyle>;
    //   },
    //   sx: { minWidth: '10vw' },
    // },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (row) => (
        <TextStyle variant="body4">{row.dueDate ? toDateString(row.dueDate) : '-'}</TextStyle>
      ),
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'aging',
      label: 'Aging',
      render: (row) => (
        <TextStyle variant="body4">{row.aging ?? '-'}</TextStyle>
      ),
      sx: { minWidth: '9vw' },
    },
    {
      key: 'statusLabel',
      label: 'Status',
      sx: { minWidth: '12vw' },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            router.push(
              replacePath(
                loanProcessingSummary.DEBTOR_INFORMATION_BAST_PAGE,
                {
                  module: pathModule,
                  processId: data.bucketProcessId,
                },
              ),
            );
          },
        }
      ],
      sx: { minWidth: '5vw' },
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
      key: 'createdDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      allowFutureDates: true,
      endKey: 'endDueDate',
      key: 'dueDate',
      label: 'Due Date',
      startKey: 'startDueDate',
      type: 'period',
    },
    {
      endKey: 'endAging',
      key: 'aging',
      label: 'Aging',
      startKey: 'startAging',
      type: 'textPeriod',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    },
  ];


  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleSubmit,
    isFetching,
    isKadivTL,
    isLoading,
    isValid,
    page,
    processList,
    processPage,
    setFilter,
    setPage,
    setPageSize,
    setValue,
    tableHeader,
    watch,
  };
};


export default useListPage;
