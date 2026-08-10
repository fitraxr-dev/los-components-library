import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetPerikatanAkadList = (
  payload: any,
  options?: any,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const response = await API('master.perikatanAkad.list', { data: payload });

          return response.data;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'perikatan-akad-list',
        payload
      ],
      ...options,
    }
  );

  return query;

};

export default useGetPerikatanAkadList;
