import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDto, GenericBucketResponseDto } from '@/helpers/api/types';
import type { UseQueryOptions } from '@tanstack/react-query';


interface DebtorListRequest {
  bucketProcessId: string;
  debtorId: string;
  tableType?: string;
}

const useGetDebtorList = (
  payload: GenericBucketRequestDto<DebtorListRequest>,
  queryConfig?: Partial<UseQueryOptions<any, any, any>>
) => {
  const query = useQuery({
    enabled: !!(payload.filter.bucketProcessId && payload.filter.debtorId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const endpoint = payload.filter.tableType === 'REQUEST'
        ? 'creditChecking.request.debtor'
        : 'creditChecking.result.debtor';

      const res = await API(endpoint, { data: payload });

      return res.data?.data;
    },
    ...queryConfig,
    queryKey: ['credit-checking', 'debtor', payload],
  });
  return query;
};

export default useGetDebtorList;
