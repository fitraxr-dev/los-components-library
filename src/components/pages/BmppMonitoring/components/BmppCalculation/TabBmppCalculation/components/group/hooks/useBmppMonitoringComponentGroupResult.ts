import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import {
  type BmppGroupsComponentResponseDto,
  type BmppGroupsRequestDto,
  BmppMonitoringControllerApi,
} from '@/services/openapi/master-service';


const api = new BmppMonitoringControllerApi();

const useBmppMonitoringComponentGroupResult = (
  payload: BmppGroupsRequestDto,
  config?: Partial<UseQueryOptions<Array<BmppGroupsComponentResponseDto>>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getResultComponentBmppGroup(payload);
      return res.data?.data?.contents;
    },
    queryKey: ['bmpp-monitoring-component-group-result', payload],
    ...config,
  });

  return query;
};

export default useBmppMonitoringComponentGroupResult;
