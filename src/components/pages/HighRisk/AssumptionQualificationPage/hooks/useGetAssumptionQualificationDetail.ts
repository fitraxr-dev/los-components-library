import { useQuery } from '@tanstack/react-query';


import { AssumptionQualificationControllerApi } from '@/services/openapi/mip-service';


import type { RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';


const api = new AssumptionQualificationControllerApi();

const useGetAssumptionQualificationDetail = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailAssumptionQualification(payload);

      return res.data?.data?.content;
    },
    queryKey: ['high-risk-assumption-qualification', payload],
  });
  return query;
};

export default useGetAssumptionQualificationDetail;
