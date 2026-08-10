import { useState, useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { accessid, engagementSubmission } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { toDateStringNumber, formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import Button from '@/components/shared/Button';
import PICRenderer from '@/components/shared/SmiSection/PICRenderer';
import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useList = () => {
  const router = useCustomRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useSessionStorage('filter-component-engagementsubmission', null);
  const canViewPengajuanPerikatan = useCheckAccess(accessid.PENGAJUAN_PERIKATAN_BUCKET_LIST_VIEW);
  const { recordActivity } = useRecordLog();

  /** Start get parameter data */
  const { data: statusOptions } = useGetParameterList('filterStatusPKBisnisList', { label: 'value1', value: 'key' });
  const { data: searchByOptions } = useGetParameterList('searchByPKList', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByPKList', { label: 'value1', value: 'value2' });
  const { data: divisionOptions } = useGetParameterList('division', { label: 'value1', value: 'key' });

  const { data, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.ENGAGEMENT_AGREEMENT,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,

  });

  useEffect(() => {
    if (data) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: '',
        module: TypeModule.ENGAGEMENT_AGREEMENT,
        process: TypeProcess.ENGAGEMENT_AGREEMENT,
        remarks: 'View list Engagement Submission',
      });
    }
  }, [data, recordActivity]);

  const totalPage = data?.page?.totalPage;

  const engagementDataList = data?.contents?.map(((item) => ({
    ...item,
    aging: item.aging ?? '-',
    createdDate: formatDate(new Date(item.createdAt)) ?? '-',
    dueDate: item.dueDate ?? '-',
  })));

  const handleOpenModalStatusPk = (bucketId: string) => {

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: bucketId,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.PROCESSING_TYPE_PK,
      remarks: `View Status PK for ID: ${bucketId}`,
    });
    return NiceModal.show(MODAL.STATUS_PK, {
      id: bucketId,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.PROCESSING_TYPE_PK,
    });
  };


  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'bucketMaster',
      label: 'Master ID',
      sx: { minWidth: '6vw' },
    },
    {
      key: 'bucketProcessId',
      label: 'ID',
      sx: { minWidth: '6vw' },
    },
    {
      key: 'institutionTypeLabel',
      label: 'Tipe Institusi',
      sx: { minWidth: '6vw' },
    },
    {
      key: 'debtorName',
      label: 'Nama Customer',
      sx: { minWidth: '14vw' },
    },
    {
      key: 'division',
      label: 'Divisi',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'staffName',
      label: 'Nama Staff',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      sx: { minWidth: '7.5vw' },
      type: 'date',
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      // type: 'date',
      render: (row) => (
        <TextStyle variant="body4">{row.dueDate !== '-' ? formatDate(row.dueDate) : '-'}</TextStyle>
      ),

      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'aging',
      label: 'Aging',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'statusLabel',
      label: 'Status',
      render: (row) => (
        <Box sx={{ pointerEvents: 'none' }}>
          <Button variant="outlined" sx={{ '&:hover': { backgroundColor: 'inherit' }, borderRadius: '16px', px: 1.5, py: 0.5 }} textVariant="body4" >
            {row.statusLabel}
          </Button>
        </Box>
      ),
      sx: { minWidth: '17vw' },
    },
    {
      key: 'statusLabel',
      label: 'Status PK',
      render: (row) => (
        <Button
          sx={{ borderRadius: '7px', px: 3, py: 1.5 }}
          textVariant="button"
          startIcon="filter-2"
          onClick={handleOpenModalStatusPk.bind(null, row?.bucketProcessId)}
        >
          View Status PK
        </Button>
      ),
      sx: { minWidth: '17vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        ...(canViewPengajuanPerikatan ? [{
          iconName: 'detail',
          onClick: (engagementDataList) => {

            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: engagementDataList.bucketProcessId,
              module: TypeModule.ENGAGEMENT_AGREEMENT,
              process: TypeProcess.ENGAGEMENT_AGREEMENT,
              remarks: `View Detail Debtor: ${engagementDataList.debtorName}`,
            });
            router.push(
              replacePath(
                engagementSubmission.DEBTOR_INFORMATION_PAGE,
                {
                  processId: engagementDataList.bucketProcessId,
                },
              ),
            );
          },
        }] : []),
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
      label: 'Division',
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
    engagementDataList,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
    totalPage,
  };
};
