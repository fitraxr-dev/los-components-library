import { useMutation } from '@tanstack/react-query';

import { RisalahRapatVerificationResultControllerApi } from '@/services/openapi/agreement-service';

import type { SendToPrivyRequestDto } from '@/services/openapi/agreement-service';


const api = new RisalahRapatVerificationResultControllerApi();


const useSubmitPrivy = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: SendToPrivyRequestDto) => {
      const res = await api.sendPrivy(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: async () => {
      onSuccess();
    },
  });

  return mutation;
};


export default useSubmitPrivy;
