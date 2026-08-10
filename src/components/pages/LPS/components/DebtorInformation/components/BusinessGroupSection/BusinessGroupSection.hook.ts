'use client';
import { useState } from 'react';

import { TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';


import useGetDebtorGroupLists from '@/components/pages/BusinessActivityReport/GroupPage/hooks/Group/useGetDebtorGroupList';

import useGetBusinessGroup from '../../hooks/useGetBusinessGroup';
import useGetBusinessGroupSelected from '../../hooks/useGetBusinessGroupSelected';


export const useBusinessGroupTable = (props: SmiComponentProps) => {
  const { module, process } = props;
  const { processId, parentId, debtorId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const { data: businessGroupListData, isLoading: businessGroupListLoading } = useGetBusinessGroupSelected({
    filter: {
      bucketProcessId: process === TypeProcess.LPS_BAST_DPOP ? parentId : processId,
      module,
      process,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const { data: debtorGrouptData, isLoading: isLoadingDebtorGroup } = useGetDebtorGroupLists({
    filter: {
      bucketProcessId: processId,
      debtorId: debtorId,
      module: module,
      process: process,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });


  const { data: bucketBusinessGroup } = useGetBusinessGroup({
    bucketProcessId: process === TypeProcess.LPS_BAST_DPOP ? parentId : processId,
    module,
    process,
  });

  const businessGroupListContents = debtorGrouptData?.contents;
  const businessGroupListPage = debtorGrouptData?.page;


  return {
    bucketBusinessGroup,
    businessGroupListContents,
    businessGroupListLoading,
    businessGroupListPage,
    noPage,
    setItemPerPage,
    setNoPage,
  };
};
