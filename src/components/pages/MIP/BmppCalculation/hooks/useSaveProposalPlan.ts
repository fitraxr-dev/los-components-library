import { useMutation } from '@tanstack/react-query';

import { BmppControllerApi } from '@/services/openapi/mip-service';

import type { ProposalPlanRequestDto } from '@/services/openapi/mip-service';


const api = new BmppControllerApi();

const useSaveProposalPlan = ({
  onSuccess = (variables) => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: ProposalPlanRequestDto) => {
      const res = await api.saveProposalPlan(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      onSuccess(variables);
    },
  });
  return mutation;
};

export default useSaveProposalPlan;
