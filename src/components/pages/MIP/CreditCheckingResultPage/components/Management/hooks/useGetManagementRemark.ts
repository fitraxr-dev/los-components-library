import { useQuery } from '@tanstack/react-query';

import { CreditCheckingExternalControllerApi } from '@/services/openapi/mip-service';

import type { CreditCheckingRemarkResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new CreditCheckingExternalControllerApi();

const useGetManagementRemark = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<CreditCheckingRemarkResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getCreditCheckingManagementRemark(payload);

      return res.data.data.content;
    },

    queryKey: ['mns-management-remark', payload],
    ...config,
  });

  return query;
};

export default useGetManagementRemark;
