import { keepPreviousData, useQuery } from '@tanstack/react-query';

import getFinancingFacilityExisting, {
  type FinancingFacilityExistingRequest,
  type FinancingFacilityExistingResponse,
} from './constant/getFinancingFacilityExisting';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetListFinancingFacilityExisting = (
  payload: FinancingFacilityExistingRequest,
  config?: Partial<UseQueryOptions<FinancingFacilityExistingResponse>>
) => {
  const isEnabled = !!payload?.filter?.debtorId;

  const query = useQuery<FinancingFacilityExistingResponse>({
    enabled: isEnabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await getFinancingFacilityExisting(payload);
      return response;
    },
    queryKey: ['financing-facility-all-existing', payload.filter?.debtorId, payload.page?.noPage, payload.page?.itemPerPage],
    ...config,
  });

  return query;
};

export default useGetListFinancingFacilityExisting;
