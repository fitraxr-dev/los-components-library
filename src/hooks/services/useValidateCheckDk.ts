import { useMutation } from '@tanstack/react-query';


import { DebtorV2ControllerApi } from '@/services/openapi/master-service';

import type { CheckValidateResultDebtorRequestDto, ValidateDebtorResponseDto } from '@/services/openapi/master-service';


const api = new DebtorV2ControllerApi();

const useValidateCheckDk = ({
  onSuccess = (data: ValidateDebtorResponseDto) => {},
  onError = (err) => {},
}) => {

  const mutation = useMutation({
    mutationFn: async (payload: CheckValidateResultDebtorRequestDto) => {
      const res = await api.checkValidateDebtor(payload);

      return res.data.data.content;
    },
    onError: (err) => {
      onError(err);
    },
    onSuccess: (data, variable) => {
      onSuccess(data);
    },
  });

  return mutation;
};


export default useValidateCheckDk;
