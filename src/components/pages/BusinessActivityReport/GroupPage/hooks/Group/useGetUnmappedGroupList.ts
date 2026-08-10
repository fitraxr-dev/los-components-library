import { keepPreviousData, useQuery } from '@tanstack/react-query';


import { ONE_MINUTE } from '@/configs/constants';
import { GroupControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoGroupRequestDto } from '@/services/openapi/bucket-service';


const api = new GroupControllerApi();

const useGetUnmappedGroupList = (payload: GenericBucketRequestDtoGroupRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.listUnmappedGroupPipeline(payload);

      return res.data;
    },
    queryKey: ['group-debitor-unmapped', payload],
    select: (data) => data.data,
    staleTime: ONE_MINUTE,

  });

  return query;
};

export default useGetUnmappedGroupList;
