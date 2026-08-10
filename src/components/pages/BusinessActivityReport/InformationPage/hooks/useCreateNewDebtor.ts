import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BarControllerApi, BucketControllerApi } from '@/services/openapi/bucket-service';

import type { BucketCreateRequestDto, DebtorRequestDto } from '@/services/openapi/bucket-service';


const barAPI = new BarControllerApi();
const bucketAPI = new BucketControllerApi();

type CreateBarProps = {
  payload: DebtorRequestDto | BucketCreateRequestDto;
  type: 'new' | 'existing';
}
const useCreateNewDebtor = ({
  onSuccess = (variables) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ payload, type }: CreateBarProps) => {

      if (type === 'new') {
        const res = await barAPI.saveBar(payload);

        return res.data;
      } else {
        const res = await bucketAPI.registerBucketDebtor(payload);

        return res.data;
      }

    },
    onError: () => {
      onError();
    },
    onSuccess: (data, _) => {
      queryClient.invalidateQueries({ queryKey: ['debtor-detail']});
      onSuccess(data);
    },
  });

  return mutation;
};

export default useCreateNewDebtor;
