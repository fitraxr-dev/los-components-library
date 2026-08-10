import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface CustomerDetailPayload {
  bucketProcessId?: string;
  module?: string;
  process?: string;
}

interface CustomerDetailResponse {
  analystId?: string | null;
  analystName?: string | null;
  bucketMasterId?: string | null;
  bucketProcessId?: string | null;
  cif?: string | null;
  debtorId?: string | null;
  debtorName?: string | null;
  gamId?: string | null;
  gamName?: string | null;
  institutionType?: string | null;
  institutionTypeLabel?: string | null;
  staffName?: string | null;
  id?: string | null;
}

const useGetCustomerDetail = (
  payload: CustomerDetailPayload,
  config?: Partial<UseQueryOptions<CustomerDetailResponse>>
) => {
  const query = useQuery<CustomerDetailResponse>({
    enabled: !!payload?.bucketProcessId,
    queryFn: async () => {
      const res = await API('bucket.bucketList.detail', {
        data: {
          bucketProcessId: payload.bucketProcessId,
          module: payload.module || 'monitoring',
          process: payload.process || 'customer-monitoring',
        },
      });

      return res.data?.data?.content ?? {};
    },
    queryKey: ['customer-detail', payload?.bucketProcessId],
    ...config,
  });

  return query;
};

export default useGetCustomerDetail;
