import { useMutation } from '@tanstack/react-query';

import { RisalahRapatVerificationResultControllerApi } from '@/services/openapi/agreement-service';

import type { SendToSpfpRequestDto } from '@/services/openapi/agreement-service';


const api = new RisalahRapatVerificationResultControllerApi();


const useSendToSPFP = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: SendToSpfpRequestDto) => {
      const res = await api.sendToSpfp(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  return mutation;
};


export default useSendToSPFP;
