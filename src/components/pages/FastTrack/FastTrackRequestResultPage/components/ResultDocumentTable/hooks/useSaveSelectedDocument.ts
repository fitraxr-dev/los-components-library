import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { QueryKey, UseMutationOptions } from '@tanstack/react-query';


export interface SaveSelectedDocumentRequest {
  id: 0;
  documentGroup: string;
  documentType: string;
  document: string;
  documentExtension: string;
  documentName: string;
  documentNumber: string;
  documentDate: string;
  bucketProcessId: string;
  fileName: string;
  ownership: string;
  ownerId: string;
  debtorId: string;
  documentCategory: string;
  summaryDetailId: 0;
  __optimistic?: {
    summaryKey: QueryKey;
    selectedKey: QueryKey;
    nextSummary: any;
    nextSelected: any;
  };
}
export interface SaveSelectedDocumentResponse {
  content: {
    id: number;
  };
}
type UseSaveSelectedDocumentDetailProps =
  UseMutationOptions<SaveSelectedDocumentResponse, Error, SaveSelectedDocumentRequest>

const useSaveSelectedDocument = (queryOptions?: UseSaveSelectedDocumentDetailProps) => {
  const queryClient = useQueryClient();

  const summaryKey = ['fast-track', 'result', 'summary-documents'];
  const selectedKey = ['fast-track', 'result', 'selected-documents'];

  const mutation = useMutation({
    mutationFn: async (payload: SaveSelectedDocumentRequest) => {
      const res = await API('fastTrack.result.saveDocument', {
        data: payload,
      });

      return res.data?.data;
    },
    onError: (err, vars, ctx: any) => {
      ctx?.prevSummary?.forEach(([key, data]) => queryClient.setQueryData(key, data));
      ctx?.prevSelected?.forEach(([key, data]) => queryClient.setQueryData(key, data));
      queryOptions?.onError?.(err, vars, ctx);
    },
    onMutate: async (payload) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: summaryKey }),
        queryClient.cancelQueries({ queryKey: selectedKey }),
      ]);

      const prevSummary = queryClient.getQueriesData({ queryKey: summaryKey });
      const prevSelected = queryClient.getQueriesData({ queryKey: selectedKey });

      return { prevSelected, prevSummary };
    },
    onSettled: async (_data, _err, _vars, ctx) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: summaryKey, refetchType: 'active' }),
        queryClient.invalidateQueries({ queryKey: selectedKey, refetchType: 'active' }),
      ]);
      queryOptions?.onSettled?.(_data, _err, _vars, ctx);
    },
    onSuccess: (data, variables, ctx) => {
      queryOptions?.onSuccess?.(data, variables, ctx);
    },
  });

  return mutation;
};

export default useSaveSelectedDocument;
