import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { SimulationBmppControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoRequestByProcessIdDtoString } from '@/services/openapi/master-service';


const api = new SimulationBmppControllerApi();

const useGetBmppSummaryListMaster = (
  payload: GenericBucketRequestDtoRequestByProcessIdDtoString,
  isEnable?: boolean) => {
  const query = useQuery({
    enabled: isEnable,
    queryFn: async () => {
      const res = await api.getBmppSummary(payload);

      return res.data.data;
    },

    queryKey: ['master-bmpp-summary-list', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetBmppSummaryListMaster;
