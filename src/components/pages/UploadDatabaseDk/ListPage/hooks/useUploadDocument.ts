import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface UploadDocumentContent {
  id: string | null;
  fileName: string | null;
  status: number | null;
  statusLabel: string | null;
  totalFailed: number | null;
  totalRow: number | null;
  totalSuccess: number | null;
  createdDate: string | null;
  modifiedDate: string | null;
  createdBy: string | null;
  modifiedBy: string | null;
  errorMessages: string | null;
  message: string | null;
}

interface UploadDocumentResponse {
  operationId: string | null;
  errorCode: string;
  errorDesc: string;
  errorSource: string;
  errorDetail: string | null;
  timestamp: string;
  data: {
    content: UploadDocumentContent;
  };
}

const useUploadDocument = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await API('master.databaseDk.upload', {
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data as UploadDocumentResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['database-dk-history-upload-list']});
    },
  });

  return mutation;
};

export default useUploadDocument;
