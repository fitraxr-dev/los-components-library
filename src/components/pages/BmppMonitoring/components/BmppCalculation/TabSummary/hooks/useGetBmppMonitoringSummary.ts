import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BmppMonitoringControllerApi } from '@/services/openapi/master-service';

import type {
  GenericBucketRequestDtoGetBucketDebtorGroupMappingRequestDto,
  GenericBucketRequestDtoRequestByProcessIdDtoString,
} from '@/services/openapi/master-service';


const api = new BmppMonitoringControllerApi();

const useGetBmppMonitoringSummary = (
  payload: GenericBucketRequestDtoRequestByProcessIdDtoString,
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getIndividualBmppSummary(payload);

      return res.data.data;
    },
    queryKey: ['bmpp-monitoring-summary', payload],
  });

  return query;
};

export default useGetBmppMonitoringSummary;
