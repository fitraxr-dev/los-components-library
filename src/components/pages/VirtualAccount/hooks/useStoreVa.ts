import { useMutation, useQueryClient } from '@tanstack/react-query';

import { VirtualAccountControllerApi } from '@/services/openapi/master-service';

import type { RequestByIdDtoString } from '@/services/openapi/master-service';
import type { AxiosError } from 'axios';


interface ApiErrorResponse {
  operationId: string;
  errorCode: string;
  errorDesc: string;
  errorDetail: string;
  errorSource: string;
  timestamp: string;
  data: string;
}

const api = new VirtualAccountControllerApi();

const useStoreVa = ({
  onSuccess = (response) => {},
  onError = (error) => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoString) => {
      const res = await api.saveSubmissionVA(payload);

      return res.data.data;
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      onError(error);
    },
    onSuccess: (response) => {
      // queryClient.invalidateQueries({ queryKey: ['um-user-submission-list']});
      // queryClient.invalidateQueries({ queryKey: ['um-user-detail']});
      // queryClient.invalidateQueries({ queryKey: ['um-submission-detail']});

      onSuccess(response);
    },
  });

  return mutation;
};

export default useStoreVa;
