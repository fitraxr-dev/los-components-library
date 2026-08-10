import { useState } from 'react';

import { usePathname } from 'next/navigation';


import { risalahRapat } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';

import Button from '@/components/shared/Button';


import { tableHeaderResultList } from './MonitoringList.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useMonitoringList = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useSessionStorage('filter-component-risalahrapat-monitoring', null);
  const router = useCustomRouter();
  const path = usePathname();
  const pathModule = getLastPath(path);

  // --- PARAMETER ---
  const { data: statusOptions } = useGetParameterList('filterStatusRisalahRapatList');
  const { data: searchByOptions } = useGetParameterList('searchByRisalahRapatList', {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByRisalahRapatList', {
    label: 'value1',
    value: 'value2',
  });

  // --- END OF PARAMETER ---


  const tableHeader: TableHeader[] = [
    ...tableHeaderResultList,
    {
      key: 'statusLabel',
      label: 'Status',
      render: (row) => (
        <Button variant="outlined" sx={{ px: 1, py: 0.5, width: 200 }} textVariant="body4">
          {row.statusLabel}
        </Button>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            router.push(
              replacePath(
                risalahRapat.DEBTOR_INFORMATION_PAGE,
                {
                  module: pathModule,
                  processId: data.bucketProcessId,
                },
              ),
            );
          },
        },
      ],
      type: 'action',
    },
  ];

  const { data, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });


  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    },
  ];

  return {
    data,
    filter,
    filterContentList,
    filterDropdownList,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};


export default useMonitoringList;
