import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetDatabaseKepatuhan = (
  payload: any,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const response = await API('master.maintenanceCustomer.internalAssessmentDK', { data: payload });

          return response.data;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'maintenance-database-kepatuhan-data',
        payload
      ],
    }
  );

  return query;

};

export default useGetDatabaseKepatuhan;
