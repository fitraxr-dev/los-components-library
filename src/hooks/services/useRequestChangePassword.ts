import { useMutation } from '@tanstack/react-query';

import { V2AuthControllerApi } from '@/services/openapi/auth-service';

import type { CreateNewPasswordRequest, UserV2 } from '@/services/openapi/auth-service';


const api = new V2AuthControllerApi();

const useRequestChangePassword = ({
  onSuccess = (data: UserV2) => {},
  onError = () => {},
  config = {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: CreateNewPasswordRequest) => {
      const res = await api.createNewPassword(payload);

      return res.data.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data: UserV2) => {
      onSuccess(data);
    },
    ...config,
  });

  return mutation;
};

export default useRequestChangePassword;
