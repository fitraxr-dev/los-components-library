import { useMutation } from '@tanstack/react-query';

import { SimulationBmppControllerApi } from '@/services/openapi/master-service';

import type { RequestByIdDtoLong } from '@/services/openapi/master-service';


const api = new SimulationBmppControllerApi();

const useDeleteProposalPlanMaster = ({
  onSuccess = (variables) => {},
  onErrorr = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteProposalPlan(payload);
      return res.data;
    },
    onError: () => {
      onErrorr();
    },
    onSuccess: (_, variables) => {
      onSuccess(variables);
    },
  });

  return mutation;
};

export default useDeleteProposalPlanMaster;
