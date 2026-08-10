import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { BmppMonitoringControllerApi } from '@/services/openapi/master-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/master-service';


const api = new BmppMonitoringControllerApi();

const useGetBmppMonitoringCustomer = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getCustomerGroup(payload);
      return res.data.data;
    },
    queryKey: ['bmpp-monitoring-customer-group', payload],
  });

  return query;
};

export default useGetBmppMonitoringCustomer;
