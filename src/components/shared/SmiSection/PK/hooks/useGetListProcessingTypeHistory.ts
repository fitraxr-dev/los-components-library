import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { PkProcessingTypeHistoryControllerApi } from '@/services/openapi/agreement-service';

import type { PKProcessingTypeRequestHistoryDto } from '@/services/openapi/agreement-service';


const api = new PkProcessingTypeHistoryControllerApi();


const useGetListProcessingTypeHistory = (
  payload: PKProcessingTypeRequestHistoryDto,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getListProcessingTypeHistory(payload);
        return res.data.data;
      },
      queryKey: [
        'processing-type-history-list',
      ],
    }
  );

  return query;
};


export default useGetListProcessingTypeHistory;
