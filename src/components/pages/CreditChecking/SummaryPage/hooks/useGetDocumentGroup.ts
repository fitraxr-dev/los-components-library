import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type { GenericBucketRequestDtoDocumentTypeRequestDto } from '@/services/openapi/bucket-document-service';


const api = new DocumentControllerApi();

const useGetDocumentGroup = (payload: GenericBucketRequestDtoDocumentTypeRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDocumentGroup(payload);

      return res.data;
    },
    queryKey: ['document-group', payload],
    staleTime: ONE_MINUTE,
  });
  return query;
};

export default useGetDocumentGroup;
