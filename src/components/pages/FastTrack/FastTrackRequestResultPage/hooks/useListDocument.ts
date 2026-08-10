import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface UseListDocumentParams {
  bucketProcessId?: string;
  enabled?: boolean;
  [key: string]: any;
}

const useListDocument = ({ bucketProcessId, enabled = true, ...rest }: UseListDocumentParams) => {
  const query = useQuery({
    enabled: !!bucketProcessId && enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucketDocument.fastTrack.listDocument', {
        data: {
          bucketProcessId,
          ...rest,
        },
      });
      return res.data;
    },
    queryKey: [
      'fast-track-list'
    ],
    select: (res) => res?.data?.content ?? [],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useListDocument;
