import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetBucketChildList = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload,
    queryFn: async () => {
      try {
        console.log('Fetching bucket child list with payload:', payload);

        const res = await API('bucket.bucketList.childList', { data: payload });

        console.log('API response (bucket child list):', res);

        return res?.data?.data ?? [];
      } catch (error) {
        console.error('API error (bucket child list):', error);
        throw error;
      }
    },
    queryKey: ['bucket-child-list', payload],
    ...config,
  });

  return query;
};

export default useGetBucketChildList;
