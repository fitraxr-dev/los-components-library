import { keepPreviousData, useQuery } from '@tanstack/react-query';


import { DocumentDebtorControllerApi } from '@/services/openapi/mip-service';

import type { DocumentDebtorResponseDto, DocumentDebtorWithTypeRequestDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DocumentDebtorControllerApi();

const useGetDebtorDocumentListWithChild = (
  payload: DocumentDebtorWithTypeRequestDto,
  config?: Partial<UseQueryOptions<DocumentDebtorResponseDto[]>>

) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { documentDebtorType, module, process, bucketProcessId, bucketIdMaster } = payload;

      const res = await api.getListDocumentDebtorIncludeChild({
        bucketProcessId,
        documentDebtorType,
        module,
        process,
      });
      return res.data.data.contents;
    },
    queryKey: ['debtor-documents-child', payload],
    ...config,
  });

  return query;
};

export default useGetDebtorDocumentListWithChild;
