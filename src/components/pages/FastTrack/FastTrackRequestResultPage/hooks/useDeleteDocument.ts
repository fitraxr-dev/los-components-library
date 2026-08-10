import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


export interface DeleteDocumentRequest {
  [key: string]: any;
}
export interface DeleteDocumentResponse {
  content: any;
}

type UseDeleteDocumentProps = UseMutationOptions<DeleteDocumentResponse, Error, DeleteDocumentRequest>;

const useDeleteDocument = (queryOptions?: UseDeleteDocumentProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DeleteDocumentRequest) => {
      const res = await API('bucketDocument.fastTrack.deleteDocument', {
        data: payload,
      });
      return res.data;
    },
    onError: (err, vars, ctx) => {
      queryOptions?.onError?.(err, vars, ctx);
    },
    onSuccess: (data, variables, ctx) => {
      queryOptions?.onSuccess?.(data, variables, ctx);
    },
  });

  return mutation;
};

export default useDeleteDocument;
