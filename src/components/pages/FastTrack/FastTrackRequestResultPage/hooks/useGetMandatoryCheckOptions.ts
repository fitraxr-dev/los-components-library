import { useQuery } from '@tanstack/react-query';


import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type { AutocompleteOption } from '@/components/shared/Autocomplete/types';
import type { UseQueryOptions } from '@tanstack/react-query';


interface UseGetMandatoryCheckOptionsParams {
  documentGroupCode?: string;
  documentTypeCode?: string;
}

const useGetMandatoryCheckOptions = (
  params?: UseGetMandatoryCheckOptionsParams,
  config?: Partial<UseQueryOptions<AutocompleteOption[]>>
) => {
  const query = useQuery<AutocompleteOption[]>({
    queryFn: async () => {
      const res = await API('bucketDocument.fastTrack.mandatoryCheckOptions', {
        data: params || {},
      });

      const data = res?.data?.data?.content || [];
      const arrayData = Array.isArray(data) ? data : [];

      return arrayData.map((item: any) => ({
        label: item.typeName,
        value: item.typeCode,
      }));
    },
    queryKey: ['fast-track-mandatory-check-options', params],
    staleTime: ONE_MINUTE,
    ...config as any,
  });

  return query;
};

export default useGetMandatoryCheckOptions;
