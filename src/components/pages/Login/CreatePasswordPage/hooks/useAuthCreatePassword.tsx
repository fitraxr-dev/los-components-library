import { Token } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import fetch from '@/helpers/fetch';
import { OtpControllerApi, V2AuthControllerApi } from '@/services/openapi/auth-service';

import type { CreateNewPasswordRequest } from '@/services/openapi/auth-service';


const url = '/api/auth/password/create';

const useAuthCreatePassword = ({ token, onSuccess, onError }: {
  token: string;
  onSuccess?: () => void;
  onError?: (errText: string) => void;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: CreateNewPasswordRequest) => {
      const res = await fetch.post(url, { ...payload, token });
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

export default useAuthCreatePassword;
