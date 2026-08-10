import { useEffect, useState } from 'react';

import { apuPpt } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import Button from '@/components/shared/Button';

import { tableHeaderList } from './VerificationList.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useVerificationList = () => {
  const router = useCustomRouter();
  const [filter, setFilter] = useSessionStorage('filter-component-apuppt-verification', null);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const statusOptions = useGetParameterList('apuPptDpopStatusFilter', { label: 'value1', value: 'value2' });
  const statusHighRiskOptions = useGetParameterList('hrStatusFilter', { label: 'value1', value: 'value2' });
  const divisionOptions = useGetParameterList('apuPptDivisionFilter');
  const searchByOptions = useGetParameterList('searchByApuPpt', {
    label: 'value1',
    value: 'value2',
  });
  const sortByOptions = useGetParameterList('sortByApuPpt', {
    label: 'value1',
    value: 'value2',
  });

  const { data, isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.APU_PPT,
      process: TypeProcess.APU_PPT_DPOP,
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tableData = data?.contents.map((item) => ({
    ...item,
    aging: item.aging ?? '-',
    debtorName: item.debtorName ?? '-',
    division: item.staffDivisionLabel ?? '-',
    id: item.bucketProcessId ?? '-',
    status: item.statusLabel?.split('|')[0] ?? '-',
    statusHighRisk: item.statusLabel?.split('|')[1] ?? '-',
  }));

  const tablePage = data?.page;

  useEffect(() => {
    setNoPage(1);
  }, [filter]);

  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'status',
      label: 'Status Assesment APU PPT / Pengkinian Data',
      sx: { minWidth: '16vw' },
      type: 'status',
    },
    {
      key: 'statusHighRisk',
      label: 'Status High Risk',
      render: (row) => (
        <Button variant="outlined" sx={{ px: 1, py: 0.5 }} textVariant="body4">
          {row.statusHighRisk}
        </Button>
      ),
      sx: { minWidth: '15vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            router.push(
              replacePath(
                apuPpt.VERIFICATION_DEBTOR_INFORMATION_PAGE,
                {
                  processId: data?.id,
                },
              ),
            );
          },
        },
      ],
      sx: { minWidth: '6vw' },
      type: 'action',
    },
  ];

  const filterDropdownList = searchByOptions.data;
  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions.data,
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
      label: 'Due Date',
      startKey: 'startDateDue',
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
      options: divisionOptions?.data,
      type: 'multiple-autocomplete',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions?.data,
      type: 'multiple-autocomplete',
    },
    {
      key: 'otherStatus',
      label: 'Status High Risk',
      options: statusHighRiskOptions?.data,
      type: 'multiple-autocomplete',
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableData,
    tableHeader,
    tablePage,
  };
};

export default useVerificationList;
