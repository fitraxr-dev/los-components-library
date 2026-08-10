import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DocumentParamControllerApi } from '@/services/openapi/bucket-document-service';

import type { AutocompleteOption } from '@/components/shared/Autocomplete/types';
import type { GenericBucketRequestDtoDocumentGroupParamRequestDto } from '@/services/openapi/bucket-document-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DocumentParamControllerApi();

const useGetParameterDocumentGroupAll = (
  config?: Partial<UseQueryOptions<AutocompleteOption[]>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDocumentGroupAll();

      const set = new Set();

      return res?.data?.data?.contents?.map((item) => ({
        label: item.documentGroupName,
        value: item.documentGroupCode,
      }));
    },
    queryKey: [
      'parameter-document-groups-all',
    ],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetParameterDocumentGroupAll;
