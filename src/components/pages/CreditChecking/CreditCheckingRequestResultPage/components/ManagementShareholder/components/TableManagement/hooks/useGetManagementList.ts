import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDto } from '@/helpers/api/types';
import type { UseQueryOptions } from '@tanstack/react-query';


interface ManagementListRequest {
  bucketProcessId: string;
  debtorId: string;
  tableType?: string;
}

const useGetManagementList = (
  payload: GenericBucketRequestDto<ManagementListRequest>,
  queryConfig?: Partial<UseQueryOptions<any, any, any>>
) => {
  const query = useQuery({
    enabled: !!(payload.filter.bucketProcessId && payload.filter.debtorId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const endpoint = payload.filter?.tableType === 'REQUEST'
        ? 'creditChecking.request.management'
        : 'creditChecking.result.management';

      const res = await API(endpoint, { data: payload });

      return res.data?.data;
    },
    ...queryConfig,
    queryKey: ['credit-checking', 'management', payload],
  });
  return query;
};

export default useGetManagementList;
