import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MaintenanceDebtorControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoString } from '@/services/openapi/master-service';


const api = new MaintenanceDebtorControllerApi();

const useGetCoBorrower = (payload: GenericBucketRequestDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.coBorrower(payload);

      return res.data.data;
    },
    queryKey: ['get-co-borrower-list', payload],
    select: (data) => data,
  });

  return query;
};

export default useGetCoBorrower;
