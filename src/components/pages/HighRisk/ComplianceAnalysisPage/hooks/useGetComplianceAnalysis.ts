import { useQuery } from '@tanstack/react-query';


import { ComplianceAnalysisControllerApi } from '@/services/openapi/mip-service';


import type { RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';


const api = new ComplianceAnalysisControllerApi();

const useGetComplianceAnalysis = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailComplianceAnalysis(payload);

      return res.data?.data?.content;
    },
    queryKey: ['high-risk-compliance-analysis', payload],
  });
  return query;
};

export default useGetComplianceAnalysis;
