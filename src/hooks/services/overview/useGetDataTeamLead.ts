import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDataTeamLead = (payload: any, config?: Partial<UseQueryOptions<any>>) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        const body = {
          role: ['TL'],
          value: payload?.value ?? '',
        };

        console.log('Calling API with payload:', body);
        const response = await API('userManagement.lov.teamLead', { data: body });
        return response.data.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['teamlead-name', payload],
    ...config,
  });

  return query;
};

export default useGetDataTeamLead;
