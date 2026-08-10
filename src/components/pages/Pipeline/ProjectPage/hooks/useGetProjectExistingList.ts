import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ProjectControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoSaveProjectRequestDto } from '@/services/openapi/bucket-service';


const api = new ProjectControllerApi();

const useGetProjectExistingList = (payload: GenericBucketRequestDtoSaveProjectRequestDto) => {

  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.listUnmappingProjectBucket(payload);

      return res.data;
    },
    queryKey: ['projects', payload],
    select: (data) => data.data,
    staleTime: ONE_MINUTE,

  });

  return query;
};

export default useGetProjectExistingList;
