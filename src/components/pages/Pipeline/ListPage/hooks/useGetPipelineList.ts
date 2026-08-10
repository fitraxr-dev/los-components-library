import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { BucketControllerApi } from '@/services/openapi/loan-service';

import type {
  GenericBucketRequestDtoPipelineFilterRequestDto,
  BaseResponseGenericBucketResponseDtoBucketPipelineResponseDto,
  GenericBucketResponseDtoBucketPipelineResponseDto,
} from '@/services/openapi/loan-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketControllerApi();

const useGetPipelineList = (
  payload: GenericBucketRequestDtoPipelineFilterRequestDto,
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<GenericBucketResponseDtoBucketPipelineResponseDto>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getBucketPipeLine(payload);

      return res.data;
    },
    queryKey: [
      'pipelines',
      {
        filter: payload.filter,
        page: payload.page,
        searchDetail: payload.searchDetail,
        sortList: payload.sortList,
      }
    ],
    select: (res: BaseResponseGenericBucketResponseDtoBucketPipelineResponseDto) => res.data,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetPipelineList;
