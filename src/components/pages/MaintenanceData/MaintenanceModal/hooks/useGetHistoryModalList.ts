import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MaintenanceCapitalControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoString } from '@/services/openapi/master-service';


const api = new MaintenanceCapitalControllerApi();

const useGetCapitalHistoryList = (payload: GenericBucketRequestDtoString) => {
  return useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getHistoryOfCapital(payload);
      return res?.data?.data;
    },
    queryKey: ['capital-history-list', payload],
  });
};

export default useGetCapitalHistoryList;
