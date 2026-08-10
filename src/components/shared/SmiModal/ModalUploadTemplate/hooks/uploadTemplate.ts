import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


interface UploadTemplatePayload {
  processTemplateType: string;
  file: File;
}

const useUploadTemplate = (
  options?: Partial<UseMutationOptions<any, any, UploadTemplatePayload>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: UploadTemplatePayload) => {
      try {
        const { processTemplateType, file } = payload;

        const response = await API('bucket.uploadTemplate.upload', {
          data: file,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          query: { processTemplateType },
        });

        return response.data;
      } catch (error) {
        throw error;
      }
    },
    ...options,
  });

  return mutation;
};

export default useUploadTemplate;
