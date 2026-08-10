import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetProposalDetail = (payload: any) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Fetching Proposal Detail with payload:', payload);

        const response = await API('mip.proposal.detail', {
          data: payload,
        });

        console.log('Proposal Detail response:', response);
        return response?.data;
      } catch (error) {
        console.error('Error fetching Proposal Detail:', error);
        throw error;
      }
    },
    queryKey: ['mip-proposal-detail', payload],
    select: (data) => data?.data?.content,
  });

  return query;
};

export default useGetProposalDetail;
