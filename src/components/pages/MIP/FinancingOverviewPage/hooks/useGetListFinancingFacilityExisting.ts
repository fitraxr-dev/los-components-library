import { useQuery } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { GenericBucketRequestDtoFinancingFacilityRequestDto } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetFinancingFacilityAllExisting = (payload: GenericBucketRequestDtoFinancingFacilityRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      try {
        const res = await api.getListExistingLosFinancingFacility(payload);

        const result = res.data.data;

        return result;
      } catch (error) {

        console.log(error);
      }
    },
    queryKey: ['financing-facility-all-existing', payload],
  });

  return query;
};

export default useGetFinancingFacilityAllExisting;
