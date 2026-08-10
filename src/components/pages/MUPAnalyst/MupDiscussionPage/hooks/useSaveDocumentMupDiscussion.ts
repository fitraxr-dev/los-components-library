import { useMutation } from '@tanstack/react-query';

import { MipDiscussionControllerApi } from '@/services/openapi/mip-service';


type SaveDocumentPayload = {
  file: string;
  bucketProcessId: string;
  bucketMasterId: string;
  module: string;
  process: string;
  analystId?: number;
  fileName: string;
  fileType: string;
  uploadId?: string;
  uploadTimestamp: string;
  uploaderId?: string;
  isAnalystConfirm?: boolean;
}

const api = new MipDiscussionControllerApi();

const useSaveDocumentMupDiscussion = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async ({
      file,
      bucketProcessId,
      module,
      process,
      fileName,
      fileType,
      analystId,
      bucketMasterId,
      uploadId,
      uploadTimestamp,
      isAnalystConfirm,
      uploaderId,
    }: SaveDocumentPayload) => {

      const res = await api.saveDocsMipDiscussion({
        analystId,
        bucketMasterId,
        bucketProcessId,
        file,
        fileName,
        fileType,
        isAnalystConfirm,
        module,
        process,
        uploadId,
        uploadTimestamp,
        uploaderId,
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveDocumentMupDiscussion;
