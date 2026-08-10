import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


interface PreviewRefinaDocumentPayload {
  title: string;
  path: string;
  subMenu: string;
  menu: string;
}

interface PreviewRefinaDocumentResponse {
  data: Blob;
  filename?: string;
}

interface UsePreviewRefinaDocumentOptions {
  onSuccess?: (data: PreviewRefinaDocumentResponse) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: PreviewRefinaDocumentResponse | undefined, error: Error | null) => void;
}

const usePreviewRefinaDocument = (
  options?: UsePreviewRefinaDocumentOptions &
  Partial<UseMutationOptions<PreviewRefinaDocumentResponse, Error, PreviewRefinaDocumentPayload>>
) => {
  const {
    onSuccess,
    onError,
    onSettled,
    ...mutationOptions
  } = options || {};

  const mutation = useMutation({
    mutationFn: async (payload: PreviewRefinaDocumentPayload) => {
      try {

        const response = await API('bucket.refina.download', {
          data: payload,
          responseType: 'blob',
        });

        // Get content type and disposition from response headers
        const contentType = response.headers['content-type'] || 'application/octet-stream';
        const contentDisposition = response.headers['content-disposition'] || '';


        // Create a blob URL for preview
        const blob = new Blob([response.data], {
          type: contentType,
        });

        // Extract filename from title or use default
        let filename = 'refina-document';

        // Try to get filename from title
        if (payload.title) {
          try {
            // Decode URL-encoded title
            const decodedTitle = decodeURIComponent(payload.title);
            filename = decodedTitle;
          } catch (error) {
            filename = payload.title;
          }
        }

        // Check if the content type is viewable in browser
        const isViewableInBrowser = contentType.startsWith('text/') ||
          contentType.startsWith('image/') ||
          contentType.startsWith('application/pdf') ||
          contentType.startsWith('application/json') ||
          contentType.startsWith('application/xml') ||
          contentType.startsWith('application/vnd.openxmlformats-officedocument') ||
          contentType.startsWith('application/vnd.ms-');


        if (isViewableInBrowser) {
          // For viewable content types, open in new tab
          const url = window.URL.createObjectURL(blob);

          // Create a temporary link element to force opening in new tab
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.style.display = 'none';

          // Add to DOM, click, and remove immediately
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up the blob URL after a short delay to prevent memory leaks
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 1000);
        } else {
          // For non-viewable content types (like zip, exe, etc.), force download
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up the URL after a delay
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 1000);
        }

        return {
          data: blob,
          filename,
        };
      } catch (error) {
        throw error;
      }
    },
    onError,
    onSettled,
    onSuccess,
    ...mutationOptions,
  });

  return mutation;
};

export default usePreviewRefinaDocument;
