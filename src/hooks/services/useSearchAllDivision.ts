import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MasterControllerApi } from '@/services/openapi/user-management-service';

import type { AutocompleteDivisionRequest, ContentsDropdown } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MasterControllerApi();

const useSearchAllDivision = (
  payload: AutocompleteDivisionRequest,
  config?: Partial<UseQueryOptions<ContentsDropdown>>) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.retrieveDivisionSearch(payload);

      return res.data.data;
    },
    queryKey: ['division', payload],
    ...config,
  });
  return query;
};

export default useSearchAllDivision;
