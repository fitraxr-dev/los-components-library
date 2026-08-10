import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type {
  GenericBucketRequestDtoDocumentTypeRequestDto,
  GenericBucketResponseDtoDocumentCreationResponseDto,
} from '@/services/openapi/bucket-document-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DocumentControllerApi();

const isDocumentListContainsNull = (data: GenericBucketResponseDtoDocumentCreationResponseDto) => {
  if (data) {
    return data.contents.some((item) => item.isSuccessUpload === false);
  }
  return true;
};

const useGetDocumentList = (
  payload: GenericBucketRequestDtoDocumentTypeRequestDto,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoDocumentCreationResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDocumentGroup(payload);

      return res.data.data;
    },
    queryKey: [
      'documents',
      payload
    ],
    refetchInterval: (query) => (isDocumentListContainsNull(query.state.data) ? 5000 : false),
    ...config,
  });

  return query;
};

export default useGetDocumentList;
