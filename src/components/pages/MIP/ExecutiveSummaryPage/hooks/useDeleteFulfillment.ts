import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FulfillmentLoanRequirementControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new FulfillmentLoanRequirementControllerApi();

const useDeleteFulfillment = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteFulfillmentLoanRequirement(payload);

      return res.data.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables: RequestByIdDtoLong) => {
      queryClient.invalidateQueries({ queryKey: ['mip-fulfillment-list']});
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteFulfillment;
