import { useQuery } from '@tanstack/react-query';

import { FinancingFacilityOverviewControllerApi } from '@/services/openapi/mip-service';

import type { GenericBucketRequestDtoDebtorRequestDebtorCode } from '@/services/openapi/master-service';


const api = new FinancingFacilityOverviewControllerApi();

const useGetListFinancingFacilityExisting = (payload: GenericBucketRequestDtoDebtorRequestDebtorCode) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getAllFinancingFacilityExisting(payload);

      return res.data.data;
    },
    queryKey: ['financing-facility-all-existing', payload],
  });

  return query;
};

export default useGetListFinancingFacilityExisting;
