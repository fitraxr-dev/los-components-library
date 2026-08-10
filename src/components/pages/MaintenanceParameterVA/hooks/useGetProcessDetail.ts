import { useQuery } from '@tanstack/react-query';

import {
  getProcessDetail,
  type GetProcessDetailRequest,
  type GetProcessDetailResponse,
} from './constant/getProcessDetail';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetProcessDetail = (
  id: string | number | null,
  bucketProcessId?: string | null,
  config?: Partial<UseQueryOptions<GetProcessDetailResponse>>
) => {
  const query = useQuery<GetProcessDetailResponse>({
    enabled: !!id,
    queryFn: async () => {
      if (!id) throw new Error('ID is required');
      return await getProcessDetail({
        bucketProcessId: bucketProcessId || null,
        id: Number(id),
      });
    },
    queryKey: ['parameter-va-process-detail', id, bucketProcessId],
    ...config,
  });

  return query;
};

export default useGetProcessDetail;
