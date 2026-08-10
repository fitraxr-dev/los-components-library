import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetBucketProcessMip = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload?.bcmId,
    queryFn: async () => {
      try {
        console.log('Calling API bucket-process-mip with payload:', payload);
        const response = await API('bucket.bucketList.mipProcess', { data: payload });
        console.log('API response:', response);
        return response.data.data.content;
      } catch (error) {
        console.error('API error (bucket-process-mip):', error);
        throw error;
      }
    },
    queryKey: [
      'bucket-process-mip',
      payload
    ],
    ...config,
  });

  return query;
};

export default useGetBucketProcessMip;
