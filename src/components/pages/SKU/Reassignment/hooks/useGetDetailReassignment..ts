import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDetailReassignment = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery<any>({
    enabled: !!payload?.bucketProcessId,
    queryFn: async () => {
      try {
        const res = await API('bucket.reassignmentSku.detail', {
          data: payload,
        });

        return res.data?.data || {};
      } catch (error) {
        console.error('Error fetching reassignment detail:', error);
        throw error;
      }
    },
    queryKey: ['bucket-detail', payload],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    ...config,
  });

  return query;
};

export default useGetDetailReassignment;
