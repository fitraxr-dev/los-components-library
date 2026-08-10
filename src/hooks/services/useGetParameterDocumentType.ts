import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DocumentParamControllerApi } from '@/services/openapi/bucket-document-service';

import type { AutocompleteOption } from '@/components/shared/Autocomplete/types';
import type { GenericBucketRequestDtoDocumentTypeParamRequestDto } from '@/services/openapi/bucket-document-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DocumentParamControllerApi();

const useGetParameterDocumentType = (
  payload: GenericBucketRequestDtoDocumentTypeParamRequestDto,
  config?: Partial<UseQueryOptions<AutocompleteOption[]>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDocumentType(payload);

      return res?.data?.data?.contents?.map((item) => ({
        id: item.documentTypeCode,
        label: item.documentTypeName,
      }));
    },
    queryKey: [
      'parameter-document-types',
      payload
    ],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetParameterDocumentType;
