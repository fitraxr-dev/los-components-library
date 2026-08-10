import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByIdDtoString } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useDeleteBucket = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoString) => {
      const res = await api.deleteBucketProcess(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todolist']});
      queryClient.invalidateQueries({ queryKey: ['bucket-list']});
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteBucket;
