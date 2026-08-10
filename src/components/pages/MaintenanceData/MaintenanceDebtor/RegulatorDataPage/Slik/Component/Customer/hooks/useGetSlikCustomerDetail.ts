import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetSlikCustomerDetail = (
  payload: any,
  options?: any,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const response = await API('master.regulatorData.detailSlikCustomer', { data: payload });

          return response.data;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'maintenance-slik-customer-detail',
        payload
      ],
      ...options,
    }
  );

  return query;

};

export default useGetSlikCustomerDetail;
