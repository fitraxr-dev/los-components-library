import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DebtorControllerApi, type DebtorAutocompleteRequestDto } from '@/services/openapi/loan-service';


const api = new DebtorControllerApi();

const useGetAllDebtorByName = (payload: DebtorAutocompleteRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDebtorAutocomplete({
        name: payload.name,
      });

      return res.data;
    },
    queryKey: ['inquiryData', { payload }],
    select: (data) => data.data, // important when there is pagination
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetAllDebtorByName;
