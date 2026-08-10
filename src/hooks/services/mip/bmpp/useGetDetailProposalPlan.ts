import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetDetailProposalPlan = ({
  onSuccess = (_data: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Get Detail Proposal Plan with payload:', payload);
        const response = await API('mip.bmpp.detailProposalPlan', {
          data: payload,
        });
        console.log('API response:', response);
        return response.data?.data?.content;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['proposal-plan']});
      onSuccess(variables);
    },
  });

  return mutation;
};

export default useGetDetailProposalPlan;
