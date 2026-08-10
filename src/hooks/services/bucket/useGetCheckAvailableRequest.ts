import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetCheckAvailableRequest = (payload: any, config?: any) => {
  const query = useQuery({
    queryFn: async () => {
      try {
        console.log('Fetching check available request with payload:', payload);
        const response = await API('bucket.bucketList.checkAvailableRequest', { data: payload });
        console.log('API response (checkAvailableRequestOtherProcess):', response);

        return response?.data?.data?.contents ?? [];
      } catch (error) {
        console.error('API error (checkAvailableRequestOtherProcess):', error);
        throw error;
      }
    },
    queryKey: ['check-available-request', payload],
    ...config,
  });

  return query;
};

export default useGetCheckAvailableRequest;
