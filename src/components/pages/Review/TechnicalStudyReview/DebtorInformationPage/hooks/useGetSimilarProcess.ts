import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { GenericSingleDtoBucketResponseDto, GetByDebtorIdRequestDto } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketControllerApi();

const useGetSimilarProcess = (
  payload: GetByDebtorIdRequestDto,
  config?: Partial<UseQueryOptions<GenericSingleDtoBucketResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getLatestCompletedSimilarProcesses(payload);
      return res.data.data;
    },
    queryKey: ['get-similar-process', payload],
    ...config,
  });

  return query;
};

export default useGetSimilarProcess;
