import { useQuery } from '@tanstack/react-query';


import { DocumentDebtorControllerApi } from '@/services/openapi/mip-service';

import type { DocumentDebtorWithTypeRequestDto } from '@/services/openapi/mip-service';


const api = new DocumentDebtorControllerApi();

const useGetDebtorDocumentList = (payload: DocumentDebtorWithTypeRequestDto) => {
  const query = useQuery({
    enabled: payload.documentDebtorType !== '',
    queryFn: async () => {
      const res = await api.getListDocumentDebtor(payload);

      return res.data.data.contents;
    },
    queryKey: ['debtor-documents', payload],
  });

  return query;
};

export default useGetDebtorDocumentList;
