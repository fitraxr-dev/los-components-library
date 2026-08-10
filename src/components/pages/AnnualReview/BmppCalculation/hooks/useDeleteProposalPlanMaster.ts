import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


type RequestByIdDtoLong = {
  id?: number;
};

const useDeleteProposalPlanMaster = ({
  onSuccess = (variables) => {},
  onErrorr = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await API('master.bmpp.deleteProposalPlan', {
        data: payload,
      });
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
