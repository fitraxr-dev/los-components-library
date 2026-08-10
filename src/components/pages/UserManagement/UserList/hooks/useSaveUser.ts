import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UserV2ControllerApi } from '@/services/openapi/user-management-service';

import type { UserModifyRequest } from '@/services/openapi/user-management-service';
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

const api = new UserV2ControllerApi();

const useSaveUser = ({
  onSuccess = (response, payload) => {},
  onError = (error) => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: UserModifyRequest) => {
      const res = await api.store(payload);

      return res.data.data;
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      onError(error);
    },
    onSuccess: (response, payload) => {
      queryClient.invalidateQueries({ queryKey: ['um-user-submission-list']});
      queryClient.invalidateQueries({ queryKey: ['um-user-detail']});
      queryClient.invalidateQueries({ queryKey: ['um-submission-detail']});

      onSuccess(response, payload);
    },
  });

  return mutation;
};

export default useSaveUser;
