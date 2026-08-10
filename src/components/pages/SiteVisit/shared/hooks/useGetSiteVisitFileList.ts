import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type {
  GenericBucketRequestDtoDocumentTypeRequestDto,
  GenericBucketResponseDtoDocumentCreationResponseDto,
} from '@/services/openapi/bucket-document-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DocumentControllerApi();

const useGetSiteVisitFileList = (
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
      'site-visit-file',
      payload
    ],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetSiteVisitFileList;
