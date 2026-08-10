import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetLpaDetail = (
  payload: any,
  options?: any,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const response = await API('lpa.lpaDetail.detail', { data: payload });

          return response.data;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'maintenance-lpa-detail-data',
        payload
      ],
      ...options,
    }
  );

  return query;

};

export default useGetLpaDetail;
