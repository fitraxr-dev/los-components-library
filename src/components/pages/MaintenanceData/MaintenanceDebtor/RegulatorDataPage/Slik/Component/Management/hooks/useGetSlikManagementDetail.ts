import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetSlikManagementDetail = (
  payload: any,
  queryConfig?: Partial<UseQueryOptions>
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const response = await API('master.regulatorData.detailSlikManagement', { data: payload });

          return response.data;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'maintenance-slik-management-detail',
        payload
      ],
      ...queryConfig,
    }
  );

  return query;

};

export default useGetSlikManagementDetail;
