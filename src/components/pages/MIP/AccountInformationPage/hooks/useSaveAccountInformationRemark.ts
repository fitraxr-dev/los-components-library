import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DebtorAccountInformationControllerApi } from '@/services/openapi/mip-service';


const api = new DebtorAccountInformationControllerApi();

const useSaveAccountInformationRemark = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveDto) => {
      const { bucketProcessId, description, module, process } = payload;

      const res = await api.saveDebtorAccountInformation(bucketProcessId, process, module, description);
      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
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

export default useSaveAccountInformationRemark;
