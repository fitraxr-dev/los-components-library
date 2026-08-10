import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


const useGetValidateResult = (
  payload: any,
  config?: Partial<any>
) => {
  const query = useQuery({
    enabled: !!payload, // hanya jalan kalau ada payload
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Fetching validate result with payload:', payload);

        const res = await API('master.debtor.validateResult', { data: payload });

        console.log('API response (validateResult):', res);

        return res?.data?.data ?? null;
      } catch (error) {
        console.error('API error (validateResult):', error);
        throw error;
      }
    },
    queryKey: ['validate-result', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetValidateResult;
