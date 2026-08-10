import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MasterControllerApi } from '@/services/openapi/user-management-service';

import type { AutocompleteRequest, ContentsDropdown } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MasterControllerApi();

const useGetAllDirectorate = (
  payload: AutocompleteRequest,
  config?: Partial<UseQueryOptions<ContentsDropdown>>,
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.retrieveAllDirectorate(payload);

      return res.data.data;
    },
    queryKey: ['get-all-directorate', payload],
    ...config,
  });
  return query;
};

export default useGetAllDirectorate;
