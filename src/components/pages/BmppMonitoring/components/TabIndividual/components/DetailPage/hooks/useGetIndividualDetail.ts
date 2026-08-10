import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BmppMonitoringControllerApi } from '@/services/openapi/master-service';

import type {
  GenericBucketRequestDtoBmppMonitoringIndividualResultRequestFilter,
} from '@/services/openapi/master-service';


const api = new BmppMonitoringControllerApi();

const useGetIndividualDetail = (payload: GenericBucketRequestDtoBmppMonitoringIndividualResultRequestFilter) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getMonitoringIndividualDetail(payload);
      return res.data.data;
    },
    queryKey: ['individual-detail-list', payload],
  });

  return query;
};

export default useGetIndividualDetail;
