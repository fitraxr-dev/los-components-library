import { useMutation } from '@tanstack/react-query';

import { ProcessorControllerApi } from '@/services/openapi/processor-service';

import type { SubmitRequestDto } from '@/services/openapi/processor-service';


const api = new ProcessorControllerApi();

const useSubmitNewWorkflow = ({
  onError = () => {},
  onSuccess = (val) => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: SubmitRequestDto) => {
      const res = await api.submitNewWorkflow(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      onSuccess(variables);
    },
  });
  return mutation;
};

export default useSubmitNewWorkflow;
