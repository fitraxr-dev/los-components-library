import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type {
  GenericBucketRequestDtoFilterListEloRequestDto,
  GenericBucketResponseDtoListEloResponseDto,
} from '@/services/openapi/bucket-document-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DocumentControllerApi();

const isDocumentListContainsNull = (data: GenericBucketResponseDtoListEloResponseDto) => {
  if (data) {
    return data.contents.some((item) => item.isSuccessUpload === false);
  }
  return true;
};

const useGetDocumentEloList = (
  payload: GenericBucketRequestDtoFilterListEloRequestDto,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoListEloResponseDto>>,
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const newLosResponse = await api.getEloDocumentGroup(payload);

      return newLosResponse.data.data;
    },
    queryKey: [
      'elo-documents',
      payload,
    ],
    refetchInterval: (query) => (isDocumentListContainsNull(query.state.data) ? 5000 : false),
    ...config,
  });

  return query;
};

export default useGetDocumentEloList;
