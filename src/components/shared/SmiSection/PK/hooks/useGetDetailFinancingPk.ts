import { useQuery } from '@tanstack/react-query';


import { FinancingFacilityControllerApi } from '@/services/openapi/agreement-service';

import type { FinancingFacilityMappingRequestDetailDto } from '@/services/openapi/agreement-service';


const api = new FinancingFacilityControllerApi();

const useGetDetailFinancingPk = (payload: any) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailFinancingFacilityMapping(payload);

      return res.data.data.content;
    },
    queryKey: ['financing-detail-pk'],
  });

  return query;
};

export default useGetDetailFinancingPk;
