import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { UseQueryOptions } from '@tanstack/react-query';


interface GetDraftMemoByIdRequest {
  id: number;
}

interface GetDraftMemoByIdResponse {
  id?: number;
  bucketProcessId?: string;
  process?: TypeProcess;
  module?: TypeModule;
  documentType?: string;
  documentName?: string;
  fileName?: string;
  fileUrl?: string;
  documentNumber?: string;
  fileExtension?: string;
  createdBy?: string;
  createdAt?: string;
  documentDate?: string;
  viewOnly?: boolean;
  isGenerated?: boolean;
  type?: string;
  bucketMasterId?: string;
  status?: string;
}

const useGetDraftMemoById = (
  payload: GetDraftMemoByIdRequest,
  queryOptions?: Partial<UseQueryOptions<GetDraftMemoByIdResponse>>,
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucketDocument.draftMemo.getById', { data: payload });
      return res.data?.data?.content;
    },
    queryKey: ['draft-memo-by-id', payload.id],
    ...queryOptions,
  });

  return query;
};

export default useGetDraftMemoById;
