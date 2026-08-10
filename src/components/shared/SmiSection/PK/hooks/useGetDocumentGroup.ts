import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/agreement-service';

import type { DocumentTypeRequestDto } from '@/services/openapi/agreement-service';


const api = new DocumentControllerApi();

const useGetDocumentGroup = (payload: DocumentTypeRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getAllDocumentList(payload);

      return res.data.data.contents;
    },
    queryKey: ['document-group-all-pk', payload],
  });
  return query;
};

export default useGetDocumentGroup;
