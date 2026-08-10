import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { BmppControllerApi } from '@/services/openapi/mip-service';

import type { GenericBucketRequestDtoRequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new BmppControllerApi();

const useGetBmppSummaryList = (
  payload: GenericBucketRequestDtoRequestByProcessIdDtoString,
  isEnable?: boolean) => {
  const query = useQuery({
    enabled: isEnable,
    queryFn: async () => {
      const res = await api.getBmppSummary(payload);

      return res.data.data;
    },

    queryKey: ['bmpp-summary-list', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetBmppSummaryList;
