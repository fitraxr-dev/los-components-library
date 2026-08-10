import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetDetailFinancingFacility = (payload: any, enabled?: boolean) => {
  const query = useQuery<any>({
    enabled: enabled || (payload !== null && payload !== undefined),
    queryFn: async () => {
      try {
        const response = await API('bucket.financialFacility.detail', {
          data: payload,
        });
        return response.data.data.content;
      } catch (error) {
        throw error;
      }
    },
    queryKey: ['financing-facility-detail', payload],
  });

  return query;
};

export default useGetDetailFinancingFacility;
