import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface ValidateResultDebtorRequestDto {
  debtorId?: string;
  bucketProcessId?: string;
  module?: string;
  process?: string;
}


const useGetValidateResultDebtor = (
  payload: ValidateResultDebtorRequestDto,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('master.debtor.validateResult', { data: payload });

      return res.data.data;
    },
    queryKey: ['validate-result-debtor', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetValidateResultDebtor;
