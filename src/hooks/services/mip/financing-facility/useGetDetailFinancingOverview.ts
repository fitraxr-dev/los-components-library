import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


const useGetDetailFinancingOverview = (payload: any) => {
  const query = useQuery<any>({
    enabled: Object.values(payload || {}).every((value) => !!value),
    queryFn: async () => {
      try {
        console.log('Calling API with payload:', payload);
        const response = await API('mip.financingFacility.detail', {
          data: payload,
        });
        console.log('API response:', response);
        return response?.data?.data?.content;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['financing-overview', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetDetailFinancingOverview;
