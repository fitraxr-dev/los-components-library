import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface FinancingFacilityMappingResponse {
  contents: Array<{
    bucketProcessId: string;
    bucketParentId: string;
    financingFacilityId: number | null;
    facilityId: string;
    process: string;
    module: string;
    lastPkNumber: string | null;
    pkName: string;
    modifiedDate: string;
  }>;
}

interface FinancingFacilityMappingPayload {
  bucketParentId: string;
}

const useGetFinancingFacilityMapping = (
  payload: FinancingFacilityMappingPayload,
  enabled: boolean = true
) => {
  const query = useQuery({
    enabled,
    queryFn: async () => {
      const res = await API('agreement.financingFacilityMapping.list', { data: payload });
      return res.data.data as FinancingFacilityMappingResponse;
    },
    queryKey: ['financing-facility-mapping', payload],
  });

  return query;
};

export default useGetFinancingFacilityMapping;
