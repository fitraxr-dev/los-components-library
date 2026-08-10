import { useMutation, useQueryClient } from '@tanstack/react-query';

import { OtpControllerApi, V2AuthControllerApi } from '@/services/openapi/auth-service';

import type { LoginRequestDto } from '@/services/openapi/auth-service';


const api = new V2AuthControllerApi();

const useRequestForgotPassword = ({ onSuccess, onError }: {
  onSuccess?: () => void;
  onError?: (errText: string) => void;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: LoginRequestDto) => {
      const res = await api.forgotPassword(payload);
      return res.data;
    },
    onError: (error) => {
      onError(error.response.data.errorDetail);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['otp-status']});
      onSuccess();
    },
  });
  return mutation;
};

export default useRequestForgotPassword;
