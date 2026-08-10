import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';

import type { CustomerDebtorRequestDto } from '@/services/openapi/bucket-service';


const master = new ApplicationDebtorControllerApi();

const useGetDebtorById = (
  payload: CustomerDebtorRequestDto,
) => {
  const query = useQuery(
    {
      initialData: {},
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await master.detailCustomerDebtor(payload);

        return res.data.data.content;
      },
      queryKey: ['debtor', payload],
    }
  );

  return query;
};


export default useGetDebtorById;
