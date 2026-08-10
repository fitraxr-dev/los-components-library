import { useEffect, useState } from 'react';

import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';
import useViewOnly from '@/hooks/useViewOnly';

import useGetDebtorGroupLists from '../hooks/Group/useGetDebtorGroupList';

import { FILTER_CONTENT_LIST, TABLE_HEADER_LIST_PAGE } from './List.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useListPage = () => {
  const { debtorId, processId } = useIdentity();
  const router = useCustomRouter();
  const theme = useTheme();

  const { viewOnly } = useViewOnly();

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const [filter, setFilter] = useState({
    filter: {
      //bucketProcessId: processId,
      debtorId,
      module: 'BAR',
      process: 'BAR',
    },
  });

  const { data: debtorGrouptData, isLoading: isLoadingDebtorGroup } = useGetDebtorGroupLists({
    filter: {
      ...filter?.filter,
      //bucketProcessId: processId,
      debtorId,
      module: TypeModule.BAR,
      process: TypeProcess.BAR,
    },
    page: {
      itemPerPage,
      noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const debtorGrouptContents = debtorGrouptData?.contents;
  const debtorGroupPage = debtorGrouptData?.page;

  const debtorGroupList = debtorGrouptContents?.map((item) => ({
    ...item,
  }));

  useEffect(() => {
    if (debtorGroupList?.length === 0) {
      setNoPage(1);
    }
  }, [debtorGroupList, filter]);

  const handlePageSizeChange = (e) => {
    setItemPerPage(e);
  };

  // Dropdown data
  const { data: sectorDropdownList } = useGetParameterList('sector');

  // Dropdown data
  const { data: searchDropdownList } = useGetParameterList('searchByDebtorGroup', { label: 'value1', value: 'value2' });

  const filterContentList = [
    ...FILTER_CONTENT_LIST,
    {
      key: 'sector',
      label: 'Sektor Industri',
      options: sectorDropdownList,
      type: 'dropdown',
    }
  ];

  const tableHeader: Array<TableHeader> = [
    ...TABLE_HEADER_LIST_PAGE,
    {
      key: 'action',
      label: 'Action',
      options: [
        { iconName: 'detail', onClick: (data: any) => router.push(`${debtorId}/detail/${data.id}`) },
      ],
      type: 'action',
    },
  ];

  return {
    debtorGroupList,
    debtorGroupPage,
    debtorId,
    filter,
    filterContentList,
    handlePageSizeChange,
    isLoadingDebtorGroup,
    noPage,
    router,
    searchDropdownList,
    sectorDropdownList,
    setFilter,
    setItemPerPage,
    setNoPage,
    tableHeader,
    theme,
    viewOnly,
  };
};
