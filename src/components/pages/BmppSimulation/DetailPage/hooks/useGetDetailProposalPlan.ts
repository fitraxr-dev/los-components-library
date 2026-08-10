import { useQuery } from '@tanstack/react-query';

import { BmppControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new BmppControllerApi();

const useGetDetailProposalPlan = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    enabled: payload.id !== null && payload.id !== undefined,
    queryFn: async () => {
      const res = await api.detailProposalPlan(payload);
      return res.data.data?.content;
    },
    queryKey: ['proposal-plan', payload],
  });
  return query;
};

export default useGetDetailProposalPlan;
