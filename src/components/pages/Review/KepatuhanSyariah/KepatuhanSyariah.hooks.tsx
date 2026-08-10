import React, { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { roles } from '@/configs/constants';
import { accessid, KEPATUHAN_SYARIAH } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, toDateString } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import Button from '@/components/shared/Button';
import PICRenderer from '@/components/shared/SmiSection/PICRenderer';
import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useKepatuhanSyariah = () => {
  const router = useCustomRouter();
  const [state] = useApp();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const path = usePathname();
  const pathModule = getLastPath(path);
  const canViewKepatuhan = useCheckAccess(accessid.SHARIAH_COMPLIANCE_REVIEW_BUCKET_LIST_VIEW);
  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('filterStatusMIPReviewDKList');
  const { data: searchByOptions } = useGetParameterList('searchByMIPReviewDKList', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByMIPReviewDKList', { label: 'value1', value: 'value2' });
  const { data: divisionOptions } = useGetParameterList('division', { label: 'value1', value: 'value2' });
  // --- END OF PARAMETER ---

  const [filter, setFilter] = useSessionStorage('filter-component-dk', null);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const { watch, setValue, handleSubmit, formState: { isDirty, touchedFields, isValid } } = useForm({
    defaultValues: {
      endDate: '',
      list: [],
      startDate: '',
    },
    mode: 'onChange',
  });


  const { data, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DK,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });


  const isKadivTL = state.currentRole.includes(roles.KADIV)
    || state.currentRole.includes(roles.TL)
    || state.currentRole.includes(roles.TL_ANALYST);

  const TABLE_HEADER: TableHeader[] = [
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
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'bucketProcessId',
      label: 'ID',
      sx: { minWidth: '6vw' },
    },
    {
      key: 'institutionTypeLabel',
      label: 'Tipe Institusi',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '14vw' },
    },
    {
      key: 'staffDivisionLabel',
      label: 'Divisi',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'staffName',
      label: 'Nama Staff',
      sx: { minWidth: '14vw' },
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
      sx: {
        minWidth: '10vw',
      },
      type: 'date',
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: { minWidth: '7.5vw' },
    },
  ];

  const tableHeader: Array<TableHeader> = [
    ...TABLE_HEADER,
    {
      key: 'statusLabel',
      label: 'Status',
      sx: {
        minWidth: '15vw',
      },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        ...(canViewKepatuhan ? [{
          iconName: 'detail', onClick: (data) => {
            router.push(
              replacePath(
                KEPATUHAN_SYARIAH.DEBTOR_INFORMATION_PAGE,
                {
                  module: pathModule,
                  processId: data.bucketProcessId,
                },
              ),
            );
          },
        }] : []),
      ],
      sx: {
        textAlign: 'center',
        width: '8%',
      },
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
      key: 'status',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionOptions,
      type: 'multiple-autocomplete',
    },

  ];


  return {
    data,
    filter,
    filterContentList,
    filterDropdownList,
    handleSubmit,
    isKadivTL,
    isLoading,
    isValid,
    page, setFilter, setPage,
    setPageSize,
    setValue,
    tableHeader,
    watch,
  };
};


export default useKepatuhanSyariah;
