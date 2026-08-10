import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ProjectControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoSaveProjectRequestDto } from '@/services/openapi/bucket-service';


const api = new ProjectControllerApi();

const useGetProjectList = (payload: GenericBucketRequestDtoSaveProjectRequestDto) => {

  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.listMappingProjectBucket(payload);

      return res.data?.data;
    },
    queryKey: ['projects-list', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetProjectList;
