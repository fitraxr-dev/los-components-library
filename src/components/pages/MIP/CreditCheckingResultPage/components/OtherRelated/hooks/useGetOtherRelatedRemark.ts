import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { CreditCheckingExternalControllerApi } from '@/services/openapi/mip-service';

import type { CreditCheckingRemarkResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new CreditCheckingExternalControllerApi();

const useGetOtherRelatedRemark = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<CreditCheckingRemarkResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getCreditCheckingOtherRelatedRemark(payload);

      return res.data.data.content;
    },
    queryKey: ['mns-other-related-remark', payload],
    ...config,
  });

  return query;
};

export default useGetOtherRelatedRemark;
