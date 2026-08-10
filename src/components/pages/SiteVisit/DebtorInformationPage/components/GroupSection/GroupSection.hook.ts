import React, { useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';


import useGetBusinessGroupList from '../../hooks/useGetBusinessGroupList';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useGroupSection = () => {
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);

  const { data: businessGroupListData, isLoading: businessGroupListLoading } = useGetBusinessGroupList({
    filter: {
      bucketProcessId: processId,
      module: TypeModule.SITE_VISIT,
      process: TypeProcess.SITE_VISIT,
    },
    page: {
      itemPerPage: 100,
      noPage: 1,
    },
  });

  const tableHeaderGroup: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { height: '3.3vw', width: '4%' },
      type: 'index',
    },
    {
      key: 'groupName',
      label: 'Nama Group Usaha',
    },
    {
      key: 'groupType',
      label: 'Jenis Group Usaha',
    },
  ];

  return {
    businessGroupListData,
    businessGroupListLoading,
    noPage,
    setNoPage,
    tableHeaderGroup,
  };
};

export default useGroupSection;
