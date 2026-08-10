import { useQuery } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/mip-service';

import type { GenericBucketRequestDtoDocumentTypeRequestDto } from '@/services/openapi/mip-service';


const api = new DocumentControllerApi();

const useGetListDocumentGroup = (payload: GenericBucketRequestDtoDocumentTypeRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDocumentGroup(payload);
      return res?.data?.data;
    },
    queryKey: ['list-document-group-rating', payload],
  });

  return query;
};


export default useGetListDocumentGroup;
