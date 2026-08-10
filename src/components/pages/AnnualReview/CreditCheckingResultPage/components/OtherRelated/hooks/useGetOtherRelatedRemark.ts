import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface CreditCheckingRemarkResponseDto {
  bucketProcessId?: string;
  remark?: string;
}

interface RequestByProcessIdDtoString {
  bucketProcessId?: string;
  module?: string;
  process?: string;
}

const useGetOtherRelatedRemark = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<CreditCheckingRemarkResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('mip.otherRelated.remark', {
        data: payload,
      });

      return res.data.data.content;
    },
    queryKey: ['mns-other-related-remark', payload],
    ...config,
  });

  return query;
};

export default useGetOtherRelatedRemark;
