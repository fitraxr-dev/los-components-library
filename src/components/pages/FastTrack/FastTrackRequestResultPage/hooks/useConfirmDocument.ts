import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


export interface ConfirmDocumentRequest {
  id: number;
  bucketProcessId: string;
  isConfirmedTl: number;
}
export interface ConfirmDocumentResponse {
  content: any;
}

type UseConfirmDocumentProps = UseMutationOptions<ConfirmDocumentResponse, Error, ConfirmDocumentRequest>;

const useConfirmDocument = (queryOptions?: UseConfirmDocumentProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ConfirmDocumentRequest) => {
      const res = await API('bucketDocument.fastTrack.confirmDocument', {
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

export default useConfirmDocument;
