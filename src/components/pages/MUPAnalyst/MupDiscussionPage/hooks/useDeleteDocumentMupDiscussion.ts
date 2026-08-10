import { useMutation } from '@tanstack/react-query';

import { MipDiscussionControllerApi } from '@/services/openapi/mip-service';

import type { FileUploadRequest } from '@/services/openapi/mip-service';


const api = new MipDiscussionControllerApi();

const useDeleteDocumentMupDiscussion = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: Pick<FileUploadRequest, 'uploadId'>) => {
      const res = await api.deleteDocsMipDiscussionByUploadId(payload);

      return res.data.data.content;
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

export default useDeleteDocumentMupDiscussion;
