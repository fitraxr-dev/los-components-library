import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type { DocumentTypeRequestDto } from '@/services/openapi/bucket-document-service';


const api = new DocumentControllerApi();

const useGetDocumentGroup = (payload: DocumentTypeRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getAllDocumentGroup(payload);

      return res.data;
    },
    queryKey: ['document-group', payload],
  });
  return query;
};

export default useGetDocumentGroup;
