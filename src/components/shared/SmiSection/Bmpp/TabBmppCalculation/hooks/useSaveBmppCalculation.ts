import { useMutation } from '@tanstack/react-query';

import { BmppControllerApi } from '@/services/openapi/mip-service';

import type { BmppDetailRequestDto } from '@/services/openapi/mip-service';


const api = new BmppControllerApi();

const useSaveBmppCalculation = ({
  onSuccess = () => {},
  onError = () => {},
}) => {

  const mutation = useMutation({
    mutationFn: async (payload: BmppDetailRequestDto) => {
      const res = await api.saveBmppDetail(payload);

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

export default useSaveBmppCalculation;
