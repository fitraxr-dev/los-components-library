import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface RegisterWorkflowRequest {
  module: string;
}

export interface RegisterWorkflowResponse {
  errorCode?: string;
  errorDesc?: string;
  data?: {
    bucketProcessId?: string;
    id?: string;
  };
  // Alternative response structure
  success?: boolean;
  message?: string;
  bucketProcessId?: string;
  id?: string;
}

const useRegisterWorkflow = () => {
  const mutation = useMutation<RegisterWorkflowResponse, Error, RegisterWorkflowRequest>({
    mutationFn: async (payload: RegisterWorkflowRequest) => {
      const res = await API('parameter.parameterLov.registerWorkflow', {
        data: payload,
      });
      return res.data;
    },
  });

  return mutation;
};

export default useRegisterWorkflow;
