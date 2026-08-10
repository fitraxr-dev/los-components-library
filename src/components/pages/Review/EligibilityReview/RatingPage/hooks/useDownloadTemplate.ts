import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface UseDownloadTemplateProps {
  onSuccess?: (data: { blob: Blob; fileName: string }) => void;
  onError?: (error: any) => void;
  onMutate?: (payload: any) => void;
  endpoint?: string;
}

const useDownloadTemplate = ({
  onSuccess = () => {},
  onError = () => {},
  onMutate = () => {},
  endpoint = 'bucketDocument.document.downloadTemplate',
}: UseDownloadTemplateProps = {}) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await API(endpoint, {
        data: payload,
        method: 'POST',
        responseType: 'blob',
      });

      return {
        blob: response.data,
        fileName: payload.fileName || 'template-document.xlsx',
      };
    },

    onError: (error, variables) => {
      console.error('Download template error:', error);
      onError(error);
    },
    onMutate: (variables) => {
      onMutate(variables);
    },
    onSuccess: (data, variables) => {
      onSuccess(data);
    },
  });

  return mutation;
};

export default useDownloadTemplate;
