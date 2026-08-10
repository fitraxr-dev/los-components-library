import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { FinancingFacilityOtherBankRequestDto } from '../FinancingFacility.type';


const useSaveFinancingFacilityOtherBank = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: FinancingFacilityOtherBankRequestDto) => {
      const res = await API('mip.financingFacilityOtherBank.save', {
        data: payload,
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['financingFacilitiesOtherBank']});
      queryClient.invalidateQueries({ queryKey: ['financingFacilityOtherBank', { id: variable.id }]});
      queryClient.invalidateQueries({ queryKey: ['financingFacilityOtherBankSummaryList',
        { bucketProcessId: variable.bucketProcessId, module: variable.module, process: variable.process }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveFinancingFacilityOtherBank;
