import { useQuery } from '@tanstack/react-query';


import { PurposeControllerApi } from '@/services/openapi/mip-service';


import type { RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';


const api = new PurposeControllerApi();

const useGetPurposeDetail = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailPurpose(payload);

      return res.data?.data?.content;
    },
    queryKey: ['high-risk-purpose-detail', payload],
  });
  return query;
};

export default useGetPurposeDetail;
