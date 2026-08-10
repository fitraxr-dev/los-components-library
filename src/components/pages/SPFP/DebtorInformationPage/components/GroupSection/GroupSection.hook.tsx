import { useState } from 'react';

import useIdentity from '@/hooks/useIdentity';

import useGetDebtorGroupLists from '@/components/pages/BusinessActivityReport/GroupPage/hooks/Group/useGetDebtorGroupList';

import useGetBusinessGroupList from '../../hooks/useGetBusinessGroupList';

import { MODULE, PROCESS } from './GroupSection.constants';


const useGroupSection = () => {
  const { debtorId, processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const { data: businessGroupListData, isLoading: businessGroupListLoading } = useGetBusinessGroupList({
    filter: {
      bucketProcessId: processId,
      module: MODULE,
      process: PROCESS,
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
      module: MODULE,
      process: PROCESS,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const businessGroupListContents = debtorGrouptData?.contents;
  const businessGroupListPage = debtorGrouptData?.page;

  return {
    businessGroupListContents,
    businessGroupListLoading,
    businessGroupListPage,
    noPage,
    setItemPerPage,
    setNoPage,
  };
};

export default useGroupSection;
