import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetBusinessGroup = (payload: any) => {
  const query = useQuery({
    enabled: !!payload?.bucketProcessId && !!payload?.module && !!payload?.process,
    initialData: [],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Fetching business groups with payload:', payload);
        const response = await API('bucket.debtor.getBusinessGroup', { data: payload });
        console.log('API response (getListDebtorGroup):', response);

        if (!response.data?.data?.contents) return [];
        const result = response.data.data.contents.map((group: any) => ({
          label: group.name,
          value: group.id?.toString(),
        }));

        return result;
      } catch (error) {
        console.error('API error (getListDebtorGroup):', error);
        throw error;
      }
    },
    queryKey: ['debtor-group-list', payload],
  });

  return query;
};

export default useGetBusinessGroup;
