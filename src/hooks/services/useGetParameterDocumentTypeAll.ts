import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DocumentParamControllerApi } from '@/services/openapi/bucket-document-service';

import type { AutocompleteOption } from '@/components/shared/Autocomplete/types';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DocumentParamControllerApi();

const useGetParameterDocumentTypeAll = (
  config?: Partial<UseQueryOptions<AutocompleteOption[]>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDocumentTypeAll();

      return res?.data?.data?.contents?.map((item) => ({
        label: item.documentTypeName,
        value: item.documentTypeCode,
      }));
    },
    queryKey: [
      'parameter-document-types-all',
    ],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetParameterDocumentTypeAll;
