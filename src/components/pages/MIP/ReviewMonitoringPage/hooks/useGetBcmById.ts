import { useMutation, useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByBcmDto } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetBcmById = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: RequestByBcmDto) => {
      const res = await api.getBucketByBcm(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      onSuccess();
    },
  });

  return mutation;
};


export default useGetBcmById;
