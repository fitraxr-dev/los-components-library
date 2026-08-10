import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ProposeFinancingStructureControllerApi } from '@/services/openapi/mip-service';

import type { GenericBucketRequestDtoListProposeFinancingStructureRequestDto } from '@/services/openapi/mip-service';


const api = new ProposeFinancingStructureControllerApi();

const useGetFinancingStructureList = (payload: GenericBucketRequestDtoListProposeFinancingStructureRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListProposeFinancingStructure(payload);

      return res?.data?.data;
    },
    queryKey: ['mup-financing-structure', payload],
  });

  return query;
};


export default useGetFinancingStructureList;
