import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { BmppGroupsComponentResponseDto, BmppGroupsRequestDto } from '../TabBmppCalculation.types';


const useBmppMonitoringComponentResult = (
  payload: BmppGroupsRequestDto,
  config?: Partial<UseQueryOptions<Array<BmppGroupsComponentResponseDto>>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('master.bmpp.monitoringIndividualGroupResult', {
        data: payload,
      });
      return res.data?.data?.contents;
    },
    queryKey: ['bmpp-monitoring-component-result', payload],
    ...config,
  });

  return query;
};

export default useBmppMonitoringComponentResult;
