import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  BmppMonitoringControllerApi,
  type GenericBucketRequestDtoBmppMonitoringIndividualRequestFilter,
} from '@/services/openapi/master-service';


const api = new BmppMonitoringControllerApi();

const useGetIndividualList = (payload: GenericBucketRequestDtoBmppMonitoringIndividualRequestFilter) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getMonitoringIndividual(payload);

      return res.data.data;
    },
    queryKey: ['individual-list', payload],
  });

  return query;
};

export default useGetIndividualList;
