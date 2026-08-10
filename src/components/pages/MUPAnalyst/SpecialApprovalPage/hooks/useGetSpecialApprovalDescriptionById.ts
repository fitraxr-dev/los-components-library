import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { SpecialApprovalControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new SpecialApprovalControllerApi();

const useGetSpecialApprovaDescriptionById = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailSpecialApproval(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['special-approval-description', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetSpecialApprovaDescriptionById;
