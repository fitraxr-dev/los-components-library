import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDtoDraftMemoRequest } from '@/services/openapi/bucket-document-service';


const useGetHistoryDraftMemoList = (payload: GenericBucketRequestDtoDraftMemoRequest) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucketDocument.draftMemo.history', { data: payload });
      return res.data.data;
    },
    queryKey: ['history-draft-memo', payload],
    refetchInterval: 10000,
    select: (data) => data,
  });

  return query;
};

export default useGetHistoryDraftMemoList;
