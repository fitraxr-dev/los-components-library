import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDebtorGroupProposalList = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery<any>({
    queryFn: async () => {
      try {
        console.log('Calling API with payload:', payload);
        const response = await API('bucket.financialFacility.groupDebtor', {
          data: payload,
        });
        console.log('API response:', response);
        return response.data.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['debtor-group-proposal-list', payload],
    ...config,
  });

  return query;
};

export default useGetDebtorGroupProposalList;
