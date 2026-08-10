import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetBusinessGroupSelected = (payload: any) => {
  const query = useQuery({
    enabled: !!payload,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Fetching business group selected with payload:', payload);
        const response = await API('bucket.debtor.getBusinessGroupSelected', { data: payload });
        console.log('API response (getListDebtorGroupSelected):', response);

        return response.data?.data ?? [];
      } catch (error) {
        console.error('API error (getListDebtorGroupSelected):', error);
        throw error;
      }
    },
    queryKey: ['debtor-group-selected-list', payload],
  });

  return query;
};

export default useGetBusinessGroupSelected;
