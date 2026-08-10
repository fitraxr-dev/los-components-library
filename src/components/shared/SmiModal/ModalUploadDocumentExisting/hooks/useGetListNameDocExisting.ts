import { useQuery } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type {
  GenericBucketRequestDtoDocumentTypeRequestDto,
  GenericBucketResponseDtoDocumentCreationResponseDto,
} from '@/services/openapi/bucket-document-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DocumentControllerApi();

const useGetListNameDocExisting = (
  payload: GenericBucketRequestDtoDocumentTypeRequestDto,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoDocumentCreationResponseDto>>) => {
  const query = useQuery<any>({
    enabled: !!payload.filter.multiDocsCategories,
    placeholderData: [],
    queryFn: async () => {
      const response = await api.getDocumentGroupByDebtorId(payload);

      return response.data.data.contents?.map((res) => ({
        ...res,
        label: res.fileName,
      }));

    },
    queryKey: ['list-name-doc-existing', payload],
    ...config,
  });

  return query;
};

export default useGetListNameDocExisting;
