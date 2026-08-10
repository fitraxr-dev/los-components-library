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
        ? 'fastTrack.request.shareholder'
        : 'fastTrack.result.shareholder';

      const res = await API(endpoint, { data: payload });

      return res.data?.data;
    },
    ...queryConfig,
    queryKey: ['fast-track', 'shareholder', payload],
  });
  return query;
};

export default useGetShareholderList;
