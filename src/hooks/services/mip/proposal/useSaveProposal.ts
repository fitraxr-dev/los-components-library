import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveProposal = ({
  onSuccess = () => {},
  onError = () => {},
}: any) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Saving Proposal with payload:', payload);

        const response = await API('mip.proposal.save', {
          data: payload,
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('Save Proposal response:', response);
        return response?.data;
      } catch (error) {
        console.error('Error saving Proposal:', error);
        throw error;
      }
    },
    onError,
    onSuccess: (_, variable) => {
      // invalidate cache agar data terkait ikut ter-refresh
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({
        queryKey: ['mip-proposal-detail', { bucketProcessId: variable.bucketProcessId }],
      });

      onSuccess();
    },
  });

  return mutation;
};

export default useSaveProposal;
