import { useQuery } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type { GenericBucketRequestDtoDocumentTypeRequestDto } from '@/services/openapi/bucket-document-service';


const api = new DocumentControllerApi();

const useGetDocumentGroupOtherRelated = (payload: GenericBucketRequestDtoDocumentTypeRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDocumentGroup(payload);

      return res.data.data;
    },
    queryKey: ['mns-document-group-other-related'],
  });

  return query;
};

export default useGetDocumentGroupOtherRelated;
