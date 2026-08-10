import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetMultirateDetail = (
  payload: any,
  options?: any,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const response = await API('master.facilityConventional.multiRateDetail', { data: payload });

          return response.data;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'conventional-multirate',
        payload
      ],
      ...options,
    }
  );

  return query;

};

export default useGetMultirateDetail;
