import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


const useGetCorrectiveActionPlan = (payload: any) => {
  const query = useQuery<any>({
    enabled: !!payload?.bucketProcessId && !!payload?.module && !!payload?.process,
    initialData: {},
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Calling API getListCorrectiveActionPlan with payload:', payload);
        const response = await API('mip.correctiveActionPlan.getList', {
          data: payload,
        });
        console.log('API response (getListCorrectiveActionPlan):', response);
        return response?.data?.data?.content;
      } catch (error) {
        console.error('API error (getListCorrectiveActionPlan):', error);
        throw error;
      }
    },
    queryKey: ['get-corrective-action-plan-bucket', payload],
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetCorrectiveActionPlan;
