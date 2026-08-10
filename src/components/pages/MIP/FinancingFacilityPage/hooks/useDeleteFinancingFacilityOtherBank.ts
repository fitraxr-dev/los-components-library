import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FinancingFacilityOtherBankControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new FinancingFacilityOtherBankControllerApi();

const useDeleteFinancingFacilityOtherBank = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteFinancingFacilityOtherBankl(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['financingFacilityOtherBank', { id: variables?.id }],
      });
      queryClient.invalidateQueries({
        queryKey: ['financingFacilitiesOtherBank'],
      });
      queryClient.invalidateQueries({ queryKey: ['financingFacilityOtherBankSummaryList']});
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteFinancingFacilityOtherBank;
