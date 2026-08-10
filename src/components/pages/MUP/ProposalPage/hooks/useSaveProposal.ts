import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FinancingProposalControllerApi } from '@/services/openapi/mip-service';


const api = new FinancingProposalControllerApi();

const useSaveProposal = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, description, process, module }: SaveDto) => {
      const res = await api.saveFinancingProposal(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['mup-proposal-detail']});
      onSuccess();
    },
  });

  return mutation;
};

type SaveDto = {
  bucketProcessId: string;
  description: any;
  module: string;
  process: string;
}

export default useSaveProposal;
