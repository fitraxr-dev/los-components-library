'use client';
import { useState } from 'react';

import useIdentity from '@/hooks/useIdentity';

// import useGetBusinessGroupSelected from './hooks/useGetBusinessGroupSelected';

import useGetDebtorGroupLists from '@/components/pages/BusinessActivityReport/GroupPage/hooks/Group/useGetDebtorGroupList';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useBusinessGroupTable = (props: any) => {
  const { module, process, debtorOnly = false } = props;
  const { processId, debtorId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  // const { data: businessGroupListData, isLoading: businessGroupListLoading } = useGetBusinessGroupSelected({
  //   filter: {
  //     bucketProcessId: processId,
  //   },
  //   page: {
  //     itemPerPage,
  //     noPage,
  //   },
  // });

  const filterParams = debtorOnly
    ? { debtorId: debtorId ?? processId }
    : {
      bucketProcessId: processId,
      debtorId,
      module,
      process,
    };

  const { data: debtorGrouptData, isLoading: isLoadingDebtorGroup } = useGetDebtorGroupLists({
    filter: filterParams,
    page: {
      itemPerPage,
      noPage,
    },
  });

  const businessGroupListContents = debtorGrouptData?.contents;
  const businessGroupListPage = debtorGrouptData?.page;

  const tableHeaderBusinessGroup: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      sx: {
        width: '4%',
      },
      type: 'index',
    },
    {
      key: 'name',
      label: 'Nama Group Usaha',
    },
    {
      key: 'groupTypeLabel',
      label: 'Jenis Group Usaha',
    },
  ];

  return {
    businessGroupListContents,
    businessGroupListLoading: isLoadingDebtorGroup,
    businessGroupListPage,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeaderBusinessGroup,
  };
};
