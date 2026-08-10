import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetDetailApolo = (
  payload: any,
  options?: any,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const response = await API('master.regulatorData.apoloDetail', { data: payload });

          return response.data;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'maintenance-apolo-detail',
        payload
      ],
      ...options,
    }
  );

  return query;

};

export default useGetDetailApolo;
