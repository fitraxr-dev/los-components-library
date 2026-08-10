import { useQuery } from '@tanstack/react-query';

// import { DetailControllerApi } from '@/services/openapi/credit-checking-service';
import { API } from '@/helpers/api';

// import type { RequestByIdDtoLong } from '@/services/openapi/credit-checking-service';
import type { UseQueryOptions } from '@tanstack/react-query';


interface ManagementDetailPayload {
  bucketProcessId: string;
  referenceCode: string;
  summaryId: number | null;
}


// const api = new DetailControllerApi();

const useGetManagementDetail = (payload: ManagementDetailPayload, config?: Partial<UseQueryOptions<any>>) => {
  const query = useQuery({
    enabled: !!payload?.bucketProcessId && !!payload?.referenceCode,
    queryFn: async () => {
      try {
        const res = await API('creditChecking.detail.management', { data: payload });

        return res?.data?.data?.content ?? null;
      } catch (error) {
        throw error;
      }
    },
    queryKey: ['mns-management-detail', payload?.bucketProcessId, payload?.referenceCode, payload?.summaryId],
    ...config,
  });

  return query;
};

export default useGetManagementDetail;
