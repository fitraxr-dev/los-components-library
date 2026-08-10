import { keepPreviousData, useQuery } from '@tanstack/react-query';

import {
  BucketControllerApi,
  type GenericBucketRequestDtoRequestByProcessIdDtoString,
} from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetListFinancingFacility = (payload: GenericBucketRequestDtoRequestByProcessIdDtoString) => {
  const query = useQuery({
    enabled: !!payload.filter.bucketProcessId,
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
