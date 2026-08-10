import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

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

const useGetDebtorRemark = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<CreditCheckingRemarkResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('mip.creditChecking.creditCheckingDebtorRemark', {
        data: payload,
      });

      return res.data.data.content;
    },
    queryKey: ['mns-debtor-remark', payload],
    ...config,
  });

  return query;
};

export default useGetDebtorRemark;
