import { useMutation } from '@tanstack/react-query';

import { SimulationBmppControllerApi } from '@/services/openapi/master-service';

import type { ProposalPlanRequestDto } from '@/services/openapi/master-service';


const api = new SimulationBmppControllerApi();

const useSaveProposalPlanMaster = ({
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

export default useSaveProposalPlanMaster;
