import { useMutation } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { BucketCreateRequestDto, BucketCreateResponseDto } from '@/services/openapi/bucket-service';


type RegisterProps = {
  urlPath: string;
  payload: BucketCreateRequestDto;
}

const api = new BucketControllerApi();

const useRegisterBucketDebtor = ({
  onSuccess = (data: BucketCreateResponseDto, variables: RegisterProps) => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async ({ payload }: RegisterProps) => {
      const res = await api.registerBucketDebtor(payload);

      return res.data?.data?.content;
    },
    onSuccess: (data, variables) => {
      onSuccess(data, variables);
    },
  });
  return mutation;
};

export default useRegisterBucketDebtor;
