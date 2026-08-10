import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


type SaveDocumentMupDiscussionProps = {
  onSuccess?: () => void;
  onError?: () => void;
};

const useSaveDocumentDiscussion = ({
  onSuccess = () => {},
  onError = () => {},
}: SaveDocumentMupDiscussionProps) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Saving Discussion document with payload:', payload);
        const response = await API('mip.mipDiscussion.saveDocsStaff', {
          data: payload,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('Save Discussion document response:', response);
        return response.data;
      } catch (error) {
        console.error('Error saving Discussion document:', error);
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

export default useSaveDocumentDiscussion;
