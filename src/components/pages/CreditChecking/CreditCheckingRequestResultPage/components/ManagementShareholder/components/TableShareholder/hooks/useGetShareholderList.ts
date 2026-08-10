import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDto } from '@/helpers/api/types';
import type { UseQueryOptions } from '@tanstack/react-query';


interface ShareholderListRequest {
  bucketProcessId: string;
  debtorId: string;
  tableType?: string;
}

const useGetShareholderList = (
  payload: GenericBucketRequestDto<ShareholderListRequest>,
  queryConfig?: Partial<UseQueryOptions<any, any, any>>
) => {
  const query = useQuery({
    enabled: !!(payload.filter.bucketProcessId && payload.filter.debtorId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const endpoint = payload.filter?.tableType === 'REQUEST'
        ? 'creditChecking.request.shareholder'
        : 'creditChecking.result.shareholder';

      const res = await API(endpoint, { data: payload });

      return res.data?.data;
    },
    ...queryConfig,
    queryKey: ['credit-checking', 'shareholder', payload],
  });
  return query;
};

export default useGetShareholderList;
