import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetListGroup = (
  payload: any,
  options?: any,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const response = await API('master.regulatorData.businessGroupList', { data: payload });

          return response.data;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'maintenance-list-group',
        payload
      ],
      ...options,
    }
  );

  return query;

};

export default useGetListGroup;
