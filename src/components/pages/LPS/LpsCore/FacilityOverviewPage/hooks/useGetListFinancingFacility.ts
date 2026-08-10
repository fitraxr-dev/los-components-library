import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDtoGetByDebtorIdRequestDto } from '../FacilityOverview.type';


const useGetListFinancingFacility = (payload: GenericBucketRequestDtoGetByDebtorIdRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.financialFacility.list', {
        data: payload,
      });
      return res.data.data;
    },
    queryKey: ['financing-facility-list', payload],
  });

  return query;
};

export default useGetListFinancingFacility;
