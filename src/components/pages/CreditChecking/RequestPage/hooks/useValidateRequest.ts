import { useMutation, useQueryClient } from '@tanstack/react-query';


import { ValidationControllerApi } from '@/services/openapi/bucket-service';

import type { ValidationRequestDto } from '@/services/openapi/bucket-service';


const api = new ValidationControllerApi();

const useValidateRequest = ({
  onSuccess = () => {},
  onError = (err) => {},
}) => {

  const mutation = useMutation({
    mutationFn: async (payload: ValidationRequestDto) => {
      const res = await api.validateRequestProcess(payload);

      return res.data.data.content;
    },
    onError: (err) => {
      onError(err);
    },
    onSuccess: (_, variable) => {
      onSuccess();
    },
  });

  return mutation;
};


export default useValidateRequest;
