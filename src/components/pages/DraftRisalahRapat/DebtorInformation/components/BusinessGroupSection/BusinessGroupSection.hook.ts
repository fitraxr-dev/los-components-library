import { useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetBusinessGroupSelected from '@/hooks/useGetBusinessGroupSelected';
import useIdentity from '@/hooks/useIdentity';

import useGetBusinessGroup from '@/components/pages/EngagementSubmission/DebtorInformationPage/hooks/useGetBusinessGroup';


const useGroupSection = () => {
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const { data: businessGroupListData, isLoading: businessGroupListLoading } = useGetBusinessGroupSelected({
    filter: {
      bucketProcessId: processId,
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const businessGroupListContents = businessGroupListData?.contents;
  const businessGroupListPage = businessGroupListData?.page;

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
