import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { RequestByIdDtoLong } from '../FinancingFacility.type';


const useDeleteFinancingFacilityOtherBank = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await API('mip.financingFacilityOtherBank.delete', {
        data: payload,
      });

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
