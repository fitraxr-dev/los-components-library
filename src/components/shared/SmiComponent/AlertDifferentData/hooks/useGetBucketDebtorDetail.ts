import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { UseQueryOptions } from '@tanstack/react-query';


interface BucketDebtorDetailRequest {
  bucketProcessId: string;
  module: TypeModule;
  process: TypeProcess;
}

const useGetBucketDebtorDetail = (
  payload: BucketDebtorDetailRequest | undefined,
  config?: Partial<UseQueryOptions<any>>
) => {
  const enableQuery = !!payload?.bucketProcessId && payload?.module !== undefined && payload?.process !== undefined;

  const query = useQuery({
    enabled: enableQuery,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.debtor.detail', { data: payload });
      return res.data?.data?.content;
    },
    queryKey: ['detail-bucket-debtor', payload],
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    ...config,
  });

  return query;
};

export default useGetBucketDebtorDetail;
