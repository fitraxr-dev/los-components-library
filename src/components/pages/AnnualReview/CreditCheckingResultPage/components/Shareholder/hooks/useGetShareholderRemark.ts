import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface RequestByProcessIdDtoString {
  bucketProcessId?: string;
  module?: string;
  process?: string;
}

const useGetCreditCheckingShareholderRemark = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('mip.shareholder.remark', {
        data: payload,
      });

      return res.data.data.content;
    },
    queryKey: ['mns-shareholder-remark', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetCreditCheckingShareholderRemark;
