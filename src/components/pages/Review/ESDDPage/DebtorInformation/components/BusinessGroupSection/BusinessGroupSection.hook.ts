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
  const { parentId } = useIdentity();

  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(parentId),
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.MIP_REVIEW,
  });

  const { data: businessGroupListData, isLoading: businessGroupListLoading } = useGetBusinessGroupSelected({
    filter: {
      bucketProcessId: debtorInfoData?.bucketParentId,
      module: TypeModule.MIP_REVIEW,
      process: TypeProcess.MIP_REVIEW,
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
