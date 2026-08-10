import React, { useState } from 'react';

import { accessid, highRisk } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';

import PICRenderer from '@/components/shared/SmiSection/PICRenderer';
import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const router = useCustomRouter();

  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const canViewBucket = useCheckAccess(accessid.HIGH_RISK_BUCKET_LIST_VIEW);

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        minWidth: '4vw',
      },
      type: 'index',
    },
    {
      key: 'bucketMaster',
      label: 'Master ID',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'bucketProcessId',
      label: 'ID',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'institutionTypeLabel',
      label: 'Tipe Institusi',
      sx: { minWidth: '15vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '13vw' },
    },
    {
      key: 'staffDivisionLabel',
      label: 'Divisi',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'staffName',
      label: 'Nama Staff',
      sx: { minWidth: '13vw' },
    },
    {
      key: 'pic',
      label: 'PIC',
      render: (row) => <PICRenderer data={row?.pic} />,
      sx: { minWidth: '10vw' },
    },
    {
      key: 'modifiedAt',
      label: 'Created Date',
      render: (row) => React.createElement(TextStyle, { variant: 'body4' }, row.modifiedAt !== null ? formatDate(row.modifiedAt, 'DD MMM YYYY, HH:mm:ss') : formatDate(row.createdAt, 'DD MMM YYYY, HH:mm:ss')),
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      sx: { minWidth: '10vw' },
      type: 'date',
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'statusLabel',
      label: 'Status',
      sx: { minWidth: '16vw' },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        ...(canViewBucket ? [{
          iconName: 'detail',
          onClick: (data) => {
            const nextPath = replacePath(highRisk.BUCKET_DEBTOR_INFORMATION_PAGE, { processId: data?.bucketProcessId });
            router.push(nextPath);
          },
        }] : [])
      ],
      type: 'action',
    },
  ];

  const { data: highRiskStatusOptions } = useGetParameterList('hrStatusFilter', { label: 'value1', value: 'value2' });
  const { data: searchByOptions } = useGetParameterList('searchByHr', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByHr', { label: 'value1', value: 'value2' });
  const { data: divisionList } = useGetParameterList('division', { label: 'value1', value: 'value2' });

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
      placeholder1: 'Start Aging',
      placeholder2: 'End Aging',
      startKey: 'startAging',
      type: 'textPeriod',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionList,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: highRiskStatusOptions,
      type: 'multiple-autocomplete',
    },
  ];


  const { data: bucketData, isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tableData = bucketData?.contents;
  const totalPage = bucketData?.page?.totalPage;

  return {
    filter,
    filterContentList,
    filterDropdownList,
    highRiskStatusOptions,
    isLoading,
    itemPerPage,
    page,
    setFilter,
    setItemPerPage,
    setPage,
    sortByOptions,
    tableData,
    tableHeader,
    totalPage,
  };
};
