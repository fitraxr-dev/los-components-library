import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ComplianceCheckControllerApi } from '@/services/openapi/agreement-service';

import type { ComplianceRequestDto, ComplianceResponseDto } from '@/services/openapi/agreement-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ComplianceCheckControllerApi();

const useGetDetailComplianceCheck = (
  payload: ComplianceRequestDto,
  config?: Partial<UseQueryOptions<ComplianceResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.detailComplianceCheck(payload);

      return res.data.data.content;
    },
    queryKey: ['get-detail-compliance-check', payload],
    // staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetDetailComplianceCheck;
