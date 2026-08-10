import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AccountBankControllerApi } from '@/services/openapi/mip-service';

import type { AccountBankRequestDto } from '@/services/openapi/mip-service';


const api = new AccountBankControllerApi();

const useSaveAccountInformation = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: AccountBankRequestDto) => {

      const res = await api.saveAccountBank(payload);
      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['detail-account-info']});
      queryClient.invalidateQueries({ queryKey: ['summary-account-information-list']});
      queryClient.invalidateQueries({ queryKey: ['account-information-list']});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['mip-account-information', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};

type SaveDto = {
  bucketProcessId?: string;
  process?: string;
  module?: string;
  description?: any;
}

export default useSaveAccountInformation;
