import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { apuPpt } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate, toDateStringNumber } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import Button from '@/components/shared/Button';

import { modal, tableHeaderList } from './RequestList.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useRequestList = () => {
  const router = useCustomRouter();
  const [filter, setFilter] = useSessionStorage('filter-component-apuppt-request', null);
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);

  const statusOptions = useGetParameterList('apuPptStatusFilter', { label: 'value1', value: 'value2' });
  const statusHighRiskOptions = useGetParameterList('hrStatusFilter', { label: 'value1', value: 'value2' });
  const divisionOptions = useGetParameterList('division');
  const searchByOptions = useGetParameterList('searchByApuPpt', {
    label: 'value1',
    value: 'value2',
  });
  const sortByOptions = useGetParameterList('sortByApuPpt', {
    label: 'value1',
    value: 'value2',
  });

  const statusApuPpt = useMemo(() => {
    let status = [];

    if (filter?.filter?.status && filter?.filter?.statusHighRisk) {
      status = [...filter?.filter?.status, ...filter?.filter?.statusHighRisk];
    } else if (filter?.filter?.statusHighRisk) {
      status = [...filter?.filter?.statusHighRisk];
    } else if (filter?.filter?.status) {
      status = [...filter?.filter?.status];
    } else {
      status = [];
    }

    return status;
  }, [filter?.filter]);

  const { data, isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.APU_PPT,
      process: TypeProcess.APU_PPT,
      // status: statusApuPpt ?? [],
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
    division: item.staffDivisionLabel,
    id: item.bucketProcessId ?? '-',
    status: item.statusLabel?.split('|')[0] ?? '-',
    statusHighRisk: item.statusLabel?.split('|')[1] ?? '-',
  }));

  const tablePage = data?.page;

  useEffect(() => {
    setNoPage(1);
  }, [filter]);

  const handleOpenAddNewModal = () => {
    NiceModal.show(modal.ADD_NEW_MODAL, {});
  };

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
                apuPpt.REQUEST_DEBTOR_INFORMATION_PAGE,
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
      label: 'Status Assesment APU PPT / Pengkinian Data',
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
    handleOpenAddNewModal,
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

export default useRequestList;
