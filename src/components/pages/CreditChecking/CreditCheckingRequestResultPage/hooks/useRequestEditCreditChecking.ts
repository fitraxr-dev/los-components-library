import { useMutation, useQueryClient } from '@tanstack/react-query';


import { RequestControllerApi } from '@/services/openapi/credit-checking-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/credit-checking-service';


const api = new RequestControllerApi();

const useRequestEditCreditChecking = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByProcessIdDtoString) => {
      const res = await api.requestEditCreditChecking(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['credit-checking-request', { bucketProcessId: variable.bucketProcessId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket', { bucketProcessId: variable.bucketProcessId }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useRequestEditCreditChecking;
