import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { BeneficialOwnerControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new BeneficialOwnerControllerApi();

const useGetBeneficialOwnerRemark = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getRemarkBeneficialOwner(payload);

      return res.data.data.content;
    },
    queryKey: ['beneficial-owner-remark', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetBeneficialOwnerRemark;
