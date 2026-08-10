import * as React from 'react';

import { usePathname } from 'next/navigation';

import { risalahRapat } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketList from '@/hooks/services/useGetBucketList';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';

import { TABLE_HEADER } from './DraftList.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { ContentList, Dropdown } from '@/components/shared/Input/Input.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDraftListPage = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const pathModule = getLastPath(path);

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [filter, setFilter] = React.useState<SearchValue>(null);

  const { data: statusOptions } = useGetParameterList('filterStatusRisalahRapatList');
  const { data: divisionOptions } = useGetParameterList('division');
  const { data: searchByOptions } = useGetParameterList('searchByRisalahRapatList', {
    label: 'value1',
    value: 'value2',
  });
  const { data: sortByOptions } = useGetParameterList('sortByRisalahRapatList', {
    label: 'value1',
    value: 'value2',
  });

  const filterDropdownList: Dropdown[] = searchByOptions;
  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Created Date',
      placeholder1: 'From',
      placeholder2: 'To',
      startKey: 'startDate',
      type: 'period',
    },
    {
      allowFutureDates: true,
      endKey: 'endDueDate',
      label: 'Due Date',
      placeholder1: 'From',
      placeholder2: 'To',
      startKey: 'startDueDate',
      type: 'period',
    },
    {
      endKey: 'endAging',
      label: 'Aging',
      placeholder1: 'From',
      placeholder2: 'To',
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

  const { data: draftRisalahRapatData, isFetching: isLoading } = useGetBucketList({
    filter: {
      ...filter?.filter,
      module: TypeModule.RISALAH_RAPAT as unknown as object,
      process: TypeProcess.RISALAH_RAPAT as unknown as object,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            const nextPath = replacePath(risalahRapat.DEBTOR_INFORMATION_PAGE, {
              module: pathModule,
              processId: data?.bucketProcessId,
            });

            router.push(nextPath);
          },
        },
      ],
      type: 'action',
    },
  ];

  return {
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableData: draftRisalahRapatData?.contents,
    tableHeader,
    totalPage: draftRisalahRapatData?.page?.totalPage,
  };
};

export default useDraftListPage;
