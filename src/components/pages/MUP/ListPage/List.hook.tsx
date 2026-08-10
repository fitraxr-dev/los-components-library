import { useEffect, useState, useMemo } from 'react';

import { mup as mupPaths } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMUPContext } from '@/components/layouts/MUPLayout/MUP.context';
import Button from '@/components/shared/Button';

import { useMUPAccess } from '../hooks/useMUPAccess';

import { tableHeaderList } from './List.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { BucketResponseDto } from '@/services/openapi/bucket-service';


const useList = () => {
  const { filterStatusMup } = useMUPContext();
  const router = useCustomRouter();
  const { setProcessId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [filter, setFilter] = useState(null);
  const { baseMUPAccess } = useMUPAccess();
  const canViewMUPList = baseMUPAccess.canView;
  const { data: mupStatusOptions } = useGetParameterList(filterStatusMup, { label: 'value1', value: 'value2' });
  const { data: searchByOptions } = useGetParameterList('searchByMup', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByMup', { label: 'value1', value: 'value2' });
  const { data: divisionOptions } = useGetParameterList('division', { label: 'value1', value: 'value2' });

  useEffect(() => {
    setProcessId(null);
    if (canViewMUPList) {
      recordActivity({
        activity: ActivityType.INITIAL_PAGE,
        bucketProcessId: '',
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
        remarks: 'view MUP list page',
      });
    }
  }, [recordActivity, canViewMUPList]);

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
      endKey: 'endDateDue',
      label: 'Periode Due Date',
      startKey: 'startDateDue',
      type: 'period',
    },
    {
      endKey: 'endAging',
      label: 'Aging',
      placeholder1: 'Day',
      placeholder2: 'Day',
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
      options: mupStatusOptions,
      type: 'multiple-autocomplete',
    },
  ];

  const payload = useMemo(() => ({
    filter: {
      ...filter?.filter,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  }), [filter, itemPerPage, noPage]);

  const { data: mupListData, isLoading } = useGetBucketList(payload, { enableRefetch: true });

  const mupListContents = mupListData?.contents.map((item) => ({
    ...item,
    aging: item.aging ?? '-',
    id: item.bucketProcessId ?? '-',
    institutionTypeLabel: item.institutionTypeLabel ?? '-',
    staffDivisionLabel: item.staffDivisionLabel ?? item.division,
  }));

  useEffect(() => {
    setNoPage(1);
  }, [filter?.searchDetail]);

  const mupListPage = mupListData?.page;

  const tableHeader: Array<TableHeader> = [
    ...tableHeaderList,
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          color="primary"
          noClick
        >
          {row.statusLabel ?? '-'}
        </Button>
      ),
      sx: { minWidth: '12vw' },
    },
    ...(canViewMUPList ? [{
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data: BucketResponseDto) => {
            recordActivity({
              activity: ActivityType.VIEW,
              bucketProcessId: data.bucketProcessId,
              changeAfter: JSON.stringify({ processId: data.bucketProcessId }),
              module: TypeModule.MUP,
              process: TypeProcess.MUP,
              remarks: `view MUP detail for ${data.debtorName}`,
            });
            router.push(
              replacePath(
                mupPaths.DEBTOR_INFORMATION_PAGE,
                { processId: data.bucketProcessId }
              ));
          },
        },
      ],
      sx: { minWidth: '12vw' },
      type: 'action' as const,
    }] : [])
  ];

  return {
    canViewMUPList,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    mupListContents,
    mupListPage,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
  };
};

export default useList;
