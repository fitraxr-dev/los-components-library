import { useMutation } from '@tanstack/react-query';

import { UserV2ControllerApi } from '@/services/openapi/user-management-service';

import type { UserValidationRequest } from '@/services/openapi/user-management-service';


const api = new UserV2ControllerApi();

const useValidateUser = ({
  onSuccess = (payload) => {},
  onError = (error) => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: UserValidationRequest) => {
      const res = await api.validate(payload);

      return res.data.data;
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: (_, payload) => {
      onSuccess(payload);
    },
  });

  return mutation;
};

export default useValidateUser;
