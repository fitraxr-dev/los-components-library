import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ComplianceCheckControllerApi } from '@/services/openapi/agreement-service';

import type {
  ComplianceRequestDto,
  ComplianceResponseDto,
  GenericListDtoComplianceResponseDto,
} from '@/services/openapi/agreement-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ComplianceCheckControllerApi();

const useGetListComplianceCheck = (
  payload: ComplianceRequestDto,
  config?: Partial<UseQueryOptions<ComplianceResponseDto[]>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.listComplianceCheck(payload);

      return res.data.data.contents;
    },
    queryKey: ['compliance-check-list'],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetListComplianceCheck;
