import { useMutation } from '@tanstack/react-query';

import { BmppControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new BmppControllerApi();

const useDeleteProposalPlan = ({
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

export default useDeleteProposalPlan;
