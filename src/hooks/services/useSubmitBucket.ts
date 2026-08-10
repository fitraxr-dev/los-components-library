import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface SubmitRequestDto {
  bucketProcessId?: string;
  module?: string;
  process?: string;
  action?: string;
  comment?: string;
  isCompleteEditAskForInfo?: boolean;
}

interface UseSubmitBucketProps {
  submitRequestDto: SubmitRequestDto;
  options?: any;
}

const useSubmitBucket = ({
  onSuccess = (data: any, variables: any) => {},
  onError = (e, variables?: any) => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: UseSubmitBucketProps) => {
      const { submitRequestDto, options } = payload;
      const res = await API('processor.processor.submitBucketProcess', {
        data: submitRequestDto,
        ...options,
      });

      return res.data;
    },
    onError: (e, variables) => {
      onError(e, variables);
    },
    onSuccess: (data, variables) => {
      onSuccess(data, variables);
    },
  });

  return mutation;
};


export default useSubmitBucket;
