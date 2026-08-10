import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type { DocumentCreationResponseDto, RequestByIdDtoLong } from '@/services/openapi/bucket-document-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DocumentControllerApi();

const useGetDocumentById = (
  payload: RequestByIdDtoLong,
  config?: Partial<UseQueryOptions<DocumentCreationResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.detailDocumentGroup(payload);

      return res.data.data.content;
    },
    queryKey: ['document', payload],
    staleTime: 0,
    ...config,
  });

  return query;
};

export default useGetDocumentById;
