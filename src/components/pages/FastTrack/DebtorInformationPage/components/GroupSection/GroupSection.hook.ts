import { useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBusinessGroupList from '@/hooks/useGetBusinessGroupSelected';
import useIdentity from '@/hooks/useIdentity';

import { useFastTrackContext } from '@/components/layouts/FastTrackLayout/FastTrack.context';

import useGetBusinessGroupMasterList from '../../hooks/useGetBusinessGroupMasterList';

import type { BucketResponseDto } from '@/services/openapi/bucket-service';


const useGroupSection = ({ bucketDetail }: {bucketDetail: BucketResponseDto}) => {
  const { isDpop, isRequestModule } = useFastTrackContext();
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(100);

  const currentModuleByBucketParent = bucketDetail?.bucketParentId ? bucketDetail?.bucketParentId.split('-')[0] : '';

  const { data: businessGroupListData, isLoading: isBusinessGroupLoading } = useGetBusinessGroupList({
    filter: {
      bucketProcessId: processId,
      module: TypeModule.FAST_TRACK,
      process: TypeProcess.FAST_TRACK,
    },
    page: {
      itemPerPage,
      noPage,
    },

  }, {
    enabled: currentModuleByBucketParent !== 'PIPE',
  });

  const { data: businessGroupMasterData, isLoading: isBusinessGroupMasterLoading } = useGetBusinessGroupMasterList({
    filter: {
      debtorId: bucketDetail?.debtorId,
    },
    page: {
      itemPerPage,
      noPage,
    },
  }, {
    enabled: currentModuleByBucketParent === 'PIPE',
  });

  const businessGroupListContents = businessGroupListData?.contents;

  const businessGroupMasterListContents = businessGroupMasterData?.contents;
  const businessGroupMasterListPage = businessGroupMasterData?.page;

  const isLoading = currentModuleByBucketParent === 'PIPE' ? isBusinessGroupMasterLoading : isBusinessGroupLoading;

  return {
    businessGroupListContents,
    businessGroupMasterListContents,
    businessGroupMasterListPage,
    currentModuleByBucketParent,
    isLoading,
    noPage,
    setItemPerPage,
    setNoPage,
  };
};

export default useGroupSection;
