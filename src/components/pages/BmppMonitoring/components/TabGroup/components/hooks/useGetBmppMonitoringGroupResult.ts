import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BmppMonitoringControllerApi } from '@/services/openapi/master-service';

import type {
  GenericBucketRequestDtoBmppMonitoringIndividualResultRequestFilter,
} from '@/services/openapi/master-service';


const api = new BmppMonitoringControllerApi();

const useGetBmppMonitoringGroupResult = (
  payload: GenericBucketRequestDtoBmppMonitoringIndividualResultRequestFilter
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getMonitoringGroupDetail(payload);
      return res.data.data;
    },
    queryKey: ['group-detail-list', payload],
  });

  return query;
};

export default useGetBmppMonitoringGroupResult;
