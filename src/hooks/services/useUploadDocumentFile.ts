import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DocumentControllerApi } from '@/services/openapi/bucket-document-service';

import type { AxiosProgressEvent } from 'axios';


const api = new DocumentControllerApi();

const useUploadDocumentFile = ({
  onSuccess = () => {},
  onError = (error: Error) => {},
  uploadProgress = (progress: number) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: {id: number; file: any}) => {
      const res = await api.uploadDocumentGroup(payload.id, payload.file, {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          uploadProgress(progressEvent?.progress);
        },
      });

      return res.data.data;
    },
    onError: (res) => {
      onError(res);
    },
    onSuccess: (res, variables) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['documents']});
      queryClient.invalidateQueries({ queryKey: ['elo-documents']});
      // queryClient.invalidateQueries({ queryKey: ['document', { id: variables.id }]});
    },
  });

  return mutation;
};


export default useUploadDocumentFile;
