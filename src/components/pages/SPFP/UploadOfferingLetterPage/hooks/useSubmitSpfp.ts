import { useMutation } from '@tanstack/react-query';

import { ProcessingControllerApi } from '@/services/openapi/agreement-service';

import type { SubmitRequestDto } from '@/services/openapi/processor-service';


const api = new ProcessingControllerApi();

interface useSubmitBucketProps {
  submitRequestDto: SubmitRequestDto;
  options?: any;
}

const useSubmitSpfp = ({
  onSuccess = (variable: any) => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: useSubmitBucketProps) => {
      const { submitRequestDto, options } = payload;
      const res = await api.submitSPFP(submitRequestDto, options);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      onSuccess(variable);

    },
  });

  return mutation;
};


export default useSubmitSpfp;
