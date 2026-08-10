import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ShareholderControllerApi } from '@/services/openapi/master-service';

import type { RequestByIdDtoLong } from '@/services/openapi/master-service';


const master = new ShareholderControllerApi();

const useGetShareholderById = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    enabled: (payload.id !== undefined || payload.id !== null) ? false : true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await master.getShareholderById(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['shareholder-detail', payload],
  });

  return query;
};


export default useGetShareholderById;
