import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { FinancingFacilityControllerApi } from '@/services/openapi/agreement-service';

import type { FinancingFacilityMappingListRequestDto } from '@/services/openapi/agreement-service';


const api = new FinancingFacilityControllerApi();


const useGetAllFinancingFacilityMapping = (
  payload: FinancingFacilityMappingListRequestDto,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getAllFinancingFacilityMapping(payload);
        return res.data.data;
      },
      queryKey: [
        'list-mapping-ff-pk',
        payload
      ],
    }
  );

  return query;
};


export default useGetAllFinancingFacilityMapping;
