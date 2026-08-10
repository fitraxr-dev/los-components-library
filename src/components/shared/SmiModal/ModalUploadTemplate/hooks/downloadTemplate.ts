import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


interface DownloadTemplatePayload {
  processTemplateType: string;
}

interface DownloadTemplateResponse {
  data: Blob;
  filename?: string;
}

const useDownloadTemplate = (
  options?: Partial<UseMutationOptions<DownloadTemplateResponse, Error, DownloadTemplatePayload>>
) => {
  const mutation = useMutation({
    mutationFn: async (payload: DownloadTemplatePayload) => {
      try {
        const { processTemplateType } = payload;

        const response = await API('bucket.uploadTemplate.download', {
          query: { processTemplateType },
          responseType: 'blob',
        });

        const blob = new Blob([response.data], {
          type: response.headers['content-type'] || 'application/octet-stream',
        });

        let filename = `${processTemplateType}-template.xlsx`;

        let contentDisposition = null;

        if (response.headers['content-disposition']) {
          contentDisposition = response.headers['content-disposition'];
        } else if (response.headers['Content-Disposition']) {
          contentDisposition = response.headers['Content-Disposition'];
        }

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
          }
        }

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return {
          data: blob,
          filename,
        };
      } catch (error) {
        console.error('Download template error:', error);
        throw error;
      }
    },
    ...options,
  });

  return mutation;
};

export default useDownloadTemplate;
