import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { UseQueryOptions } from '@tanstack/react-query';


interface CheckDocumentUpdatesRequest {
  module: TypeModule;
  process: TypeProcess;
  document: 'BENEFICIAL_OWNER' | 'CUSTOMER_DUE_DILIGENCE' | (string & {});
  applicationCategory: 'APU_PPT' | 'DATA_UPDATES' | (string & {});
}

const useCheckDocumentUpdates = (
  payload: CheckDocumentUpdatesRequest | undefined,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: Boolean(payload.module && payload.process && payload.document && payload.applicationCategory),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('mip.documentComponent.checkUpdates', { data: payload });

      return res.data?.data?.content;
    },
    queryKey: ['mip', 'check-updates', payload],
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    ...config,
  });

  return query;
};

export default useCheckDocumentUpdates;
