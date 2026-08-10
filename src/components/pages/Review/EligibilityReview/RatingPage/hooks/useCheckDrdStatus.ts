import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface CheckDrdStatusPayload {
  bucketProcessId?: string;
  moduleName?: string;
  processName?: string;
  debtorName?: string;
}

interface DrdStatusContent {
  debtorId: string | null;
  debtorName: string;
  ratingDetail: any;
  exist?: boolean;
}

interface DrdStatusResponse {
  content: DrdStatusContent;
}

const useCheckDrdStatus = (
  payload: CheckDrdStatusPayload,
  config?: Partial<UseQueryOptions<DrdStatusResponse>>
) => {
  const query = useQuery<any>({
    enabled: !!payload.debtorName,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucketDocument.document.checkDrdStatus', {
        data: payload,
      });
      return res.data?.data?.content ?? {};
    },
    queryKey: ['check-drd-status', payload],
    ...config,
  });

  return {
    ...query,
  };
};

export default useCheckDrdStatus;
