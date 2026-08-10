import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


const useGetDocumentEloDownload = (
  options?: Partial<UseMutationOptions<any, any, any>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        const response = await API('bucketDocument.elo.download', {
          data: { urlDoc: payload?.urlDoc || payload }, // Support both old and new format
          responseType: 'blob',
        });

        // Return response with filename if provided
        return {
          ...response,
          filename: payload.filename || 'document',
        };
      } catch (error) {
        console.error('Download API error:', error);
        throw error;
      }
    },
    ...options,
  });

  return mutation;
};

export default useGetDocumentEloDownload;
