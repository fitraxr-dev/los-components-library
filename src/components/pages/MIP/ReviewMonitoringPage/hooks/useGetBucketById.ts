import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { BucketResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';
import type { DocumentCreationRequestDto } from '@/services/openapi/loan-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BucketControllerApi();

const useGetBucketById = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: RequestByProcessIdDtoString) => {
      const res = await api.getBucketDetail(payload);

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


export default useGetBucketById;
