import React, { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { roles } from '@/configs/constants';
import { accessid, ESDD } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, toDateString } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';


import Button from '@/components/shared/Button';
import PICRenderer from '@/components/shared/SmiSection/PICRenderer';
import TextStyle from '@/components/shared/TextStyle';

import { useESDDAccess } from './hooks/useESDDAccess';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useEsdd = () => {
  const router = useCustomRouter();
  const [state] = useApp();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const canViewEsdd = useCheckAccess(accessid.ESDD_BUCKET_LIST_VIEW);
  const path = usePathname();
  const pathModule = getLastPath(path);

  useEffect(() => {
    if (processId) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: String(processId || ''),
        changeAfter: JSON.stringify({ processId }),
        module: TypeModule.MIP_REVIEW,
        process: TypeProcess.REVIEWER_DELST,
        remarks: 'view ESDD main page',
      });
    }
  }, [processId, recordActivity]);

  const [filter, setFilter] = useSessionStorage('filter-component-delst', null);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      endDate: '',
      list: [],
      startDate: '',
    },
    mode: 'onChange',
  });

  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList(
    'filterStatusMIPReviewESDDList'
  );
  const { data: searchByOptions } = useGetParameterList(
    'searchByMIPReviewESDDList',
    {
      label: 'value1',
      value: 'value2',
    }
  );
  const { data: sortByOptions } = useGetParameterList(
    'sortByMIPReviewESDDList',
    {
      label: 'value1',
      value: 'value2',
    }
  );
  const { data: divisionOptions } = useGetParameterList('division', { label: 'value1', value: 'value2' });

  // --- END OF PARAMETER ---

  const { data, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.REVIEWER_DELST,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const isKadivTL =
    state.currentRole.includes(roles.KADIV) ||
    state.currentRole.includes(roles.TL) ||
    state.currentRole.includes(roles.TL_ANALYST);

  const TABLE_HEADER: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
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
      sx: { minWidth: '10vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '15vw' },
    },
    {
      key: 'staffDivisionLabel',
      label: 'Divisi',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'staffName',
      label: 'Nama Staff',
      sx: { minWidth: '10vw' },
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
      sx: { minWidth: '7.5vw' },
      type: 'date',
    },
    {
      key: 'aging',
      label: 'Aging',
      render: (row) => (
        <TextStyle variant="body4">{row.aging ?? '-'}</TextStyle>
      ),
      sx: { minWidth: '10vw' },
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
        ...(canViewEsdd ? [{
          iconName: 'detail',
          onClick: (data) => {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: String(data.bucketProcessId),
              changeAfter: JSON.stringify({ bucketProcessId: data.bucketProcessId, debtorName: data.debtorName }),
              module: TypeModule.MIP_REVIEW,
              process: TypeProcess.REVIEWER_DELST,
              remarks: 'view ESDD bucket detail',
            });

            router.push(
              replacePath(ESDD.DEBTOR_INFORMATION_PAGE, {
                module: pathModule,
                processId: data.bucketProcessId,
              })
            );
          },
        }] : []),
      ],
      sx: {
        textAlign: 'center',
        width: '8%',
      },
      type: 'action' as const,
    }
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
    page,
    setFilter,
    setPage,
    setPageSize,
    setValue,
    tableHeader,
    watch,
  };
};

export default useEsdd;
