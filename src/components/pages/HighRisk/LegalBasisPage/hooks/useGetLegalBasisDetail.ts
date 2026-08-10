import { useQuery } from '@tanstack/react-query';


import { LegalBasisControllerApi } from '@/services/openapi/mip-service';


import type { RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';


const api = new LegalBasisControllerApi();

const useGetLegalBasisDetail = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDetailLegalBasis(payload);

      return res.data?.data?.content;
    },
    queryKey: ['high-risk-legal-basis-detail', payload],
  });
  return query;
};

export default useGetLegalBasisDetail;
