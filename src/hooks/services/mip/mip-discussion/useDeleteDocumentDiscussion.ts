import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


type DeleteDocumentDiscussionProps = {
  onSuccess?: () => void;
  onError?: () => void;
};

const useDeleteDocumentDiscussion = ({
  onSuccess = () => {},
  onError = () => {},
}: DeleteDocumentDiscussionProps) => {
  const mutation = useMutation({
    mutationFn: async (payload: { uploadId: string; bucketProcessId: string; module: string; process: string }) => {
      try {
        console.log('Deleting Discussion document with payload:', payload);
        const response = await API('mip.mipDiscussion.deleteDocsStaff', {
          data: payload,
        });
        console.log('Delete Discussion document response:', response);
        return response.data?.data?.content;
      } catch (error) {
        console.error('Error deleting Discussion document:', error);
        throw error;
      }
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

export default useDeleteDocumentDiscussion;
