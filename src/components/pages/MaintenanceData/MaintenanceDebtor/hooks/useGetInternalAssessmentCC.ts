import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetInternalAssessmentCC = (
  payload: any,
  options?: any,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const response = await API('master.maintenanceCustomer.internalAssessmentCreditChecking', { data: payload });

          return response.data;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'maintenance-internal-assessment-cc-data',
        payload
      ],
      ...options,
    }
  );

  return query;

};

export default useGetInternalAssessmentCC;
