import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreditorControllerApi } from '@/services/openapi/mip-service';

import type { CreditorRequestDto } from '@/services/openapi/mip-service';


const api = new CreditorControllerApi();

const useSaveCreditor = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: CreditorRequestDto) => {
      const res = await api.saveCreditor(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      onSuccess();
    },
  });
  return mutation;
};

export default useSaveCreditor;
