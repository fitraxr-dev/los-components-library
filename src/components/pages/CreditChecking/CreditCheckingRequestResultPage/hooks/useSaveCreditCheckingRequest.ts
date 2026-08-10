import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RequestControllerApi } from '@/services/openapi/credit-checking-service';

import type { SaveCreditCheckingRequestDto } from '@/services/openapi/credit-checking-service';


const api = new RequestControllerApi();

const useSaveCreditCheckingRequest = ({
  onSuccess = (_, variable) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveCreditCheckingRequestDto) => {
      const res = await api.creationCreditChecking(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: async (_, variable) => {
      await queryClient.invalidateQueries({ queryKey: ['credit-checking-request', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess(_, variable);
    },
  });

  return mutation;
};

export default useSaveCreditCheckingRequest;
