import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetExposureGroup = (payload: any) => {
  const query = useQuery({
    enabled: !!payload?.bucketProcessId,
    initialData: [],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Fetching exposure group with payload:', payload);
        const response = await API('bucket.bucketList.totalExposureGroup', { data: payload });
        console.log('API response (getExposureGroupBucket):', response);

        return response?.data?.data?.contents ?? [];
      } catch (error) {
        console.error('API error (getExposureGroupBucket):', error);
        throw error;
      }
    },
    queryKey: ['debtor-exposure-group', payload],
  });

  return query;
};

export default useGetExposureGroup;
