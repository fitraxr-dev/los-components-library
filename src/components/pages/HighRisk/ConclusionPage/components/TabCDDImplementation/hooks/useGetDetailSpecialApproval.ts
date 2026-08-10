import { useQuery } from '@tanstack/react-query';

import { SpecialApprovalControllerApi, type RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new SpecialApprovalControllerApi();

const useGetDetailSpecialApproval = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailSpecialApproval(payload);

      return res.data.data.content;
    },

    queryKey: ['special-approval', payload],
  });

  return query;
};

export default useGetDetailSpecialApproval;
