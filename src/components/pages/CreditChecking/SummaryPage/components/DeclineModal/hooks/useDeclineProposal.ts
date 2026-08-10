import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProposalControllerApi } from '@/services/openapi/mip-service';

import type { DeclineProposal } from '@/services/openapi/mip-service';


const api = new ProposalControllerApi();
const useDeclineProposal = ({
  onSuccess,
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DeclineProposal) => {
      const res = await api.declineProposal(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      await queryClient.invalidateQueries({ queryKey: ['draft-memos']});
      onSuccess(data);
    },
  });

  return mutation;
};

export default useDeclineProposal;
