import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { DocumentDebtorControllerApi } from '@/services/openapi/mip-service';

import type {
  DataDeltaResponseDtoListDocumentDebtorResponseDto,
  GenericWithPreviousDataRequestDto,
} from '@/services/openapi/mip-service';


const api = new DocumentDebtorControllerApi();

const useGetDebtorDocumentDataDelta = (
  payload: GenericWithPreviousDataRequestDto,
  config?: Partial<UseQueryOptions<DataDeltaResponseDtoListDocumentDebtorResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {

      const res = await api.getDataDeltaDocumentDebtor(payload);
      return res.data.data.content;
    },
    queryKey: ['debtor-document-data-delta', payload],
    ...config,
  });

  return query;
};

export default useGetDebtorDocumentDataDelta;
