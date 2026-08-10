'use client';
import { useEffect } from 'react';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBucketChildList from '@/hooks/services/useGetBucketChildList';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';


const useViewAllDocLpsCore = () => {
  const { parentId, processId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const { data: childList, isLoading, isFetching, refetch, isSuccess } = useGetBucketChildList({
    filter: {
      bucketParent: parentId,
      module: TypeModule.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.PROCESSING_TYPE_PK,
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
    searchDetail: { key: '', value: '' },
    sortList: undefined,
  });

  useEffect(() => {
    if (!isLoading && !isFetching) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId,
        module: TypeModule.LPS,
        process: TypeProcess.LPS_CORE,
        remarks: 'view all document page',
      });
    }
  }, [isLoading, isFetching, processId, recordActivity]);
  const bucketId = isSuccess && childList.contents?.find((res) => res?.bucketProcessId?.includes('LPSB'))?.bucketProcessId || '';
  return {
    bucketId,
  };
};

export default useViewAllDocLpsCore;
