import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDtoBucketDetailRequestDto } from '@/services/openapi/bucket-service';


const useGetListFinancingFacility = (payload: GenericBucketRequestDtoBucketDetailRequestDto) => {
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
