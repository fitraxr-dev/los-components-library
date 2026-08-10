import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetBucketByBcm = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery<any>({
    enabled: Object.values(payload || {}).every((value) => !!value),
    queryFn: async () => {
      try {
        console.log('Calling API (bucket) with payload:', payload);
        const response = await API('bucket.bcm.getBcm', {
          data: payload,
        });
        console.log('API response (bucket):', response);
        return response?.data?.data?.content;
      } catch (error) {
        console.error('API error (bucket):', error);
        throw error;
      }
    },
    queryKey: ['bcm', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetBucketByBcm;
