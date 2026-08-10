import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetSlikPenjaminDetail = (
  payload: any,
  queryConfig?: Partial<UseQueryOptions>
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const response = await API('master.regulatorData.detailSlikPenjamin', { data: payload });

          return response.data;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'maintenance-slik-penjamin-detail',
        payload
      ],
      ...queryConfig,
    }
  );

  return query;

};

export default useGetSlikPenjaminDetail;
