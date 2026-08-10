import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { DraftMemoControllerApi } from '@/services/openapi/bucket-document-service';

import type { GenericBucketRequestDtoDraftMemoRequest } from '@/services/openapi/bucket-document-service';


const api = new DraftMemoControllerApi();

const useGetHistoryDraftMemoList = (payload: GenericBucketRequestDtoDraftMemoRequest) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDraftMemoHistory(payload);

      return res.data.data;
    },
    queryKey: ['history-draft-memo', payload],
    select: (data) => data,
  });

  return query;
};

export default useGetHistoryDraftMemoList;
