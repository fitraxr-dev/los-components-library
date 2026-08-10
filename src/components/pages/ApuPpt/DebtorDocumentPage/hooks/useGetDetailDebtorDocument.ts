import { useQuery } from '@tanstack/react-query';

import { DocumentDebtorControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new DocumentDebtorControllerApi();

const useGetDetailDebtorDocument = (payload: RequestByIdDtoLong) => {

  const query = useQuery({
    enabled: payload.id !== null || payload.id !== undefined,
    queryFn: async () => {
      const res = await api.getDetailDocumentDebtor(payload);

      return res.data.data.content;
    },
    queryKey: ['debtor-document', payload],
  });
  return query;
};

export default useGetDetailDebtorDocument;
