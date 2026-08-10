import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetSlikFinancingFacilityList = (
  payload: any,
  options?: any,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const response = await API('master.regulatorData.listSlikFinancingFacility', { data: payload });

          return response.data;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'maintenance-slik-financing-facility-list',
        payload
      ],
      ...options,
    }
  );

  return query;

};

export default useGetSlikFinancingFacilityList;
