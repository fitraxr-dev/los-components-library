import { useQuery } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type {
  GenericBucketRequestDtoDocumentTypeRequestDto,
  GenericBucketResponseDtoDocumentCreationResponseDto,
} from '@/services/openapi/bucket-document-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DocumentControllerApi();

const useGetDocumentGroupByOwnerIdList = (
  payload: GenericBucketRequestDtoDocumentTypeRequestDto,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoDocumentCreationResponseDto>>) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDocumentGroupByOwnerId(payload);

      return res.data.data;
    },

    queryKey: ['documents', payload],
    ...config,
  });

  return query;
};

export default useGetDocumentGroupByOwnerIdList;
