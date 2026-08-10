import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetExposureDebtor = (payload: any) => {
  const query = useQuery({
    enabled: payload && Object.values(payload).every((value) => !!value),
    initialData: {},
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Fetching debtor exposure with payload:', payload);
        const response = await API('bucket.bucketList.totalExposure', { data: payload });
        console.log('API response (getExposureBucket):', response);

        return response?.data?.data?.content ?? {};
      } catch (error) {
        console.error('API error (getExposureBucket):', error);
        throw error;
      }
    },
    queryKey: ['debtor-finance-exposure', { bucketProcessId: payload?.bucketProcessId }],
  });

  return query;
};

export default useGetExposureDebtor;
