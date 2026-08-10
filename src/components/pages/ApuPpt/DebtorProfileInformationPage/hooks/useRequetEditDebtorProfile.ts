import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DebtorProfileInformationControllerApi } from '@/services/openapi/mip-service';

import type { DebtorProfileInformationRequestEditResponseDto } from '@/services/openapi/mip-service';


const api = new DebtorProfileInformationControllerApi();


const useRequestEditProfileInformation = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: DebtorProfileInformationRequestEditResponseDto) => {
      const res = await api.saveDebtorProfileInformation1(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      onSuccess();
    },
  });

  return mutation;
};

export default useRequestEditProfileInformation;
