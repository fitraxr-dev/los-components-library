import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface UseDetailDocumentParams {
  documentId?: string | number;
  bucketProcessId?: string;
  module?: string;
  process?: string;
  enabled?: boolean;
}

const useDetailDocument = ({
  documentId,
  bucketProcessId,
  module,
  process,
  enabled = true,
}: UseDetailDocumentParams) => {
  const query = useQuery({
    enabled: !!documentId && !!bucketProcessId && enabled,
    queryFn: async () => {
      const res = await API('bucketDocument.fastTrack.detailDocument', {
        data: {
          bucketProcessId,
          id: documentId,
          module,
          process,
        },
      });
      return res.data;
    },
    queryKey: ['detail-fast-track'],
    select: (res) => res?.data?.content ?? null,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useDetailDocument;
