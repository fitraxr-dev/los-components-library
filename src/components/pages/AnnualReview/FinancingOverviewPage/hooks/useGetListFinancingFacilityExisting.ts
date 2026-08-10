import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDtoFinancingFacilityRequestDto } from '../FinancingOverview.type';


const useGetFinancingFacilityAllExisting = (payload: GenericBucketRequestDtoFinancingFacilityRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      try {
        const res = await API('bucket.financialFacility.existLos', {
          data: payload,
        });

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
