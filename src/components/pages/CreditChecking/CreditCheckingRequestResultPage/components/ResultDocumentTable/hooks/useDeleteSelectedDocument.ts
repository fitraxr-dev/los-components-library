import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


export interface DeleteSelectedDocumentRequest {
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
}
export interface DeleteSelectedDocumentResponse {
  content: {
    content: string;
  };
}
type UseDeleteSelectedDocumentDetailProps =
  UseMutationOptions<DeleteSelectedDocumentResponse, Error, DeleteSelectedDocumentRequest>

const useDeleteSelectedDocument = (queryOptions?: UseDeleteSelectedDocumentDetailProps) => {
  const queryClient = useQueryClient();

  const summaryKey = ['credit-checking', 'result', 'summary-documents'];
  const selectedKey = ['credit-checking', 'result', 'selected-documents'];

  const mutation = useMutation({
    mutationFn: async (payload: DeleteSelectedDocumentRequest) => {
      const res = await API('creditChecking.result.deleteDocument', {
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

export default useDeleteSelectedDocument;
