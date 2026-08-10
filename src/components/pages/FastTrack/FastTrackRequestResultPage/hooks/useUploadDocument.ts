import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


export interface UploadDocumentRequest {
  [key: string]: any;
}
export interface UploadDocumentResponse {
  content: any;
}

type UseUploadDocumentProps = UseMutationOptions<UploadDocumentResponse, Error, UploadDocumentRequest>;

const useUploadDocument = (queryOptions?: UseUploadDocumentProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: UploadDocumentRequest | FormData) => {
      const res = await API('bucketDocument.fastTrack.uploadDocument', {
        data: payload,
        headers: payload instanceof FormData ? {
          'Content-Type': 'multipart/form-data',
        } : undefined,
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

export default useUploadDocument;
