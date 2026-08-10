import { keepPreviousData, useQuery } from '@tanstack/react-query';


import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { BucketResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketControllerApi();

const useGetDebtorDetail = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<BucketResponseDto>>) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getBucketDetail(payload);

      return res.data.data.content;
    },
    queryKey: ['debtor-detail', { payload }],
    ...config,
  });

  return query;
};

export default useGetDebtorDetail;
