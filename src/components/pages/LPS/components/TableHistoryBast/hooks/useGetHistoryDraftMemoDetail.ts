import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DraftMemoControllerApi } from '@/services/openapi/bucket-document-service';

import type { RequestByIdDtoLong } from '@/services/openapi/bucket-document-service';


const api = new DraftMemoControllerApi();

const useGetHistoryDraftMemoDetail = ({ id }: RequestByIdDtoLong) => {
  const query = useQuery({
    enabled: id !== undefined && id !== null,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDraftMemoById({ id });

      return res.data.data.content;
    },
    queryKey: ['history-draft-memo-detail', { id }],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetHistoryDraftMemoDetail;
