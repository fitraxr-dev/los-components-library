import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FulfillmentLoanRequirementControllerApi } from '@/services/openapi/mip-service';


const api = new FulfillmentLoanRequirementControllerApi();

const useSaveFullfillmentLoanRequirement = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (
      { id, bucketProcessId, termType, term, category, process, module, fulfillment, termCondition }: SaveDto) => {
      const res = await api.saveFulfillmentLoanRequirement(
        bucketProcessId, process, module, id, termType, term, category, fulfillment, termCondition);
      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['mup-fulfillment-list']});
      onSuccess();
    },
  });

  return mutation;
};

type SaveDto = {
  bucketProcessId: string;
  process: string;
  module: string;
  id?: number;
  termType?: string;
  term?: string;
  category?: string;
  fulfillment?: string;
  termCondition?: any;
  options?: any;
}

export default useSaveFullfillmentLoanRequirement;
