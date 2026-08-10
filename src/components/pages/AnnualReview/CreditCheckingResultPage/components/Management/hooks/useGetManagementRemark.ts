import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';
import { CreditCheckingExternalControllerApi } from '@/services/openapi/mip-service';

import type { UseQueryOptions } from '@tanstack/react-query';


interface RequestByProcessIdDtoString {
  bucketProcessId?: string;
  module?: string;
  process?: string;
}

interface CreditCheckingRemarkResponseDto {
  bucketProcessId?: string;
  remark?: string;
}

const api = new CreditCheckingExternalControllerApi();

const useGetManagementRemark = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<CreditCheckingRemarkResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('mip.creditChecking.creditCheckingManagementRemark', {
        data: payload,
      });

      return res.data.data.content;
    },

    queryKey: ['mns-management-remark', payload],
    ...config,
  });

  return query;
};

export default useGetManagementRemark;
