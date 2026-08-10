import { keepPreviousData, useQuery } from '@tanstack/react-query';


import {
  DebtorV2ControllerApi,
  type GenericBucketRequestDtoDebtorFilterRequestDto,
} from '@/services/openapi/master-service';


const api = new DebtorV2ControllerApi();

const useGetDebtorList = (payload: GenericBucketRequestDtoDebtorFilterRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getAllDebtor(payload);

      return res.data.data;
    },
    queryKey: ['debtor-list', payload],
  });

  return query;
};

export default useGetDebtorList;
