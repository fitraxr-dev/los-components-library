import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ProjectControllerApi } from '@/services/openapi/bucket-service';

import type {
  GenericBucketRequestDtoSaveProjectRequestDto,
  GenericBucketResponseDtoProjectDto,
} from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ProjectControllerApi();

const useGetUnmappedProjectList = (
  payload: GenericBucketRequestDtoSaveProjectRequestDto,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoProjectDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.listUnmappingProjectBucket(payload);

      return res.data.data;
    },
    queryKey: ['unmapped-project-list', payload],
    ...config,
  });

  return query;
};

export default useGetUnmappedProjectList;
