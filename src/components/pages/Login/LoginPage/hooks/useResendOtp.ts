import { useMutation, useQueryClient } from '@tanstack/react-query';

import { OtpControllerApi } from '@/services/openapi/auth-service';


const api = new OtpControllerApi();

const useResendOtp = ({ token, onSuccess, onError }: {
  token: string;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.resendOtp({ headers: { Authorization: token } });
      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['otp-status']});
      onSuccess();
    },
  });
  return mutation;
};

export default useResendOtp;
