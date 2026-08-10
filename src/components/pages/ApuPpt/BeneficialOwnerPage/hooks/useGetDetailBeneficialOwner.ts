import { useQuery } from '@tanstack/react-query';

import { BeneficialOwnerControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new BeneficialOwnerControllerApi();

const useGetDetailBeneficialOwner = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    enabled: payload.id !== null || payload.id !== undefined,
    queryFn: async () => {
      const res = await api.getDetailBeneficialOwner(payload);

      return res.data.data.content;
    },
    queryKey: ['beneficial-owner', payload],
  });

  return query;
};

export default useGetDetailBeneficialOwner;
