import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DocumentControllerApi } from '@/services/openapi/agreement-service';

import type { DocumentCreationResponseDto, RequestByIdDtoLong } from '@/services/openapi/agreement-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new DocumentControllerApi();

const useDetailDocumentGroup = (
  payload: RequestByIdDtoLong,
  config?: Partial<UseQueryOptions<DocumentCreationResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.detailDocumentGroup(payload);

      return res.data.data.content;
    },
    queryKey: ['document', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useDetailDocumentGroup;
