import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RisalahRapatVerificationResultControllerApi } from '@/services/openapi/agreement-service';

import type {
  GenericBucketRequestDtoRequestByProcessIdDtoString,
  GenericBucketResponseDtoDocumentVerificationResultResponseDto,
} from '@/services/openapi/agreement-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new RisalahRapatVerificationResultControllerApi();

const useGetVerificationResult = (
  payload: GenericBucketRequestDtoRequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoDocumentVerificationResultResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListDocumentVerificationResult(payload);

      return res.data.data;
    },
    queryKey: [
      'documents',
      payload
    ],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetVerificationResult;
