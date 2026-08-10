import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { DraftMemoControllerApi, type RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new DraftMemoControllerApi();

const useGetHistoryDraftMemoDetail = ({ id }: RequestByIdDtoLong) => {
  const query = useQuery({
    enabled: id !== undefined && id !== null,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.detailDraftMemo({ id });

      return res.data;
    },
    queryKey: ['history-draft-memo-detail', { id }],
    select: (data) => data.content,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetHistoryDraftMemoDetail;
