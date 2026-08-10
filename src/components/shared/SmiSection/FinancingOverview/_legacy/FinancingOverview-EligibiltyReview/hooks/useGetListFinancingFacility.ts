import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  BucketControllerApi,
  type GenericBucketRequestDtoBucketDetailRequestDto,
} from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetListFinancingFacility = (payload: GenericBucketRequestDtoBucketDetailRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListFinanceFacilityByBucketProcessId(payload);

      return res.data.data;
    },
    queryKey: ['financing-facility-list', payload],
  });

  return query;
};

export default useGetListFinancingFacility;
