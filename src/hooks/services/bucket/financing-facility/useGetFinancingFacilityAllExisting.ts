import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetFinancingFacilityAllExisting = (payload: any) => {
  const query = useQuery<any>({
    queryFn: async () => {
      try {
        console.log('Calling API with payload:', payload);
        const response = await API('bucket.financialFacility.existLos', {
          data: payload,
        });
        console.log('API response:', response);
        return response.data.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['financing-facility-all-existing', payload],
  });

  return query;
};

export default useGetFinancingFacilityAllExisting;
