import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ComplianceCheckControllerApi } from '@/services/openapi/agreement-service';

import type { ComplianceRequestDto, ComplianceResponseDto } from '@/services/openapi/agreement-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ComplianceCheckControllerApi();

const useGetDetailComplianceCheckChild = (
  payload: ComplianceRequestDto,
  config?: Partial<UseQueryOptions<ComplianceResponseDto>>
) => {
  const query = useQuery({
    gcTime: 0,
    queryFn: async () => {
      const res = await api.detailComplianceCheck1(payload);

      return res.data.data.content;
    },
    queryKey: ['get-detail-compliance-check-child', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetDetailComplianceCheckChild;
