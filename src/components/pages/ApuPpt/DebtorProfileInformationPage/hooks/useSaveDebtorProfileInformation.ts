import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DebtorProfileInformationControllerApi } from '@/services/openapi/mip-service';

import type { DebtorProfileInformationRequestDto } from '@/services/openapi/mip-service';


const api = new DebtorProfileInformationControllerApi();


const useSaveDebtorProfileInformation = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: DebtorProfileInformationRequestDto) => {
      const res = await api.saveDebtorProfileInformation(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['get-debtor-information']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveDebtorProfileInformation;
