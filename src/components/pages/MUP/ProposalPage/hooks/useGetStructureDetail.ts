import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ProposeFinancingStructureControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new ProposeFinancingStructureControllerApi();

const useGetStructureDetail = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    queryFn: async () => {
      if (!payload?.id) return ;
      const res = await api.getDetailProposeFinancingStructure(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['mup-structure-detail', payload],
  });

  return query;
};


export default useGetStructureDetail;
