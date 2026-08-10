/* eslint-disable max-len */
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BmppMonitoringControllerApi } from '@/services/openapi/master-service';

import type {
  BaseResponseGenericBucketWithAdditionalDataResponseDtoBmppMonitoringResultListResponseGeneralAdditionalDataLastUpdated,
  GenericBucketRequestDtoBmppMonitoringIndividualResultRequestFilter,
} from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';

// Inisialisasi instance API
const api = new BmppMonitoringControllerApi();

type BmppMonitoringResponse = BaseResponseGenericBucketWithAdditionalDataResponseDtoBmppMonitoringResultListResponseGeneralAdditionalDataLastUpdated;

const useGetBmpk = (
  payload: GenericBucketRequestDtoBmppMonitoringIndividualResultRequestFilter,
  config?: Partial<UseQueryOptions<BmppMonitoringResponse>>,
) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getMonitoringGroupDetail(payload);
      return res?.data;
    },
    queryKey: ['get-monitoring-group-detail', payload],
    ...config,
  });
};

export default useGetBmpk;
