import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  BmppMonitoringControllerApi,
  type GenericBucketRequestDtoBmppMonitoringIndividualRequestFilter,
} from '@/services/openapi/master-service';


const api = new BmppMonitoringControllerApi();

const useGetBmppMonitoringIndividual = (
  payload: GenericBucketRequestDtoBmppMonitoringIndividualRequestFilter,
  options?: { enabled?: boolean }
) => {
  const query = useQuery({
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getMonitoringIndividual(payload);
      return res.data;
    },
    queryKey: ['bmpp-monitoring-individual', payload],
  });

  return query;
};

export default useGetBmppMonitoringIndividual;
