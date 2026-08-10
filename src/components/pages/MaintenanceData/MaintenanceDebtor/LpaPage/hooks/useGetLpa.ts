import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetLpa = (
  payload: any,
  options?: any,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const response = await API('master.maintenanceCustomer.lpa', { data: payload });

          return response.data;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'maintenance-lpa-data',
        payload
      ],
      ...options,
    }
  );

  return query;

};

export default useGetLpa;
