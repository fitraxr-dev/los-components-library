import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface ProposalPlanRequestDto {
  id?: number;
  debtorId?: string;
  groupId?: string;
  proposalPlanValue?: string;
}

const useSaveProposalPlanMaster = ({
  onSuccess = (variables) => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: ProposalPlanRequestDto) => {
      const res = await API('master.bmpp.saveProposalPlan', {
        data: payload,
      });

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
