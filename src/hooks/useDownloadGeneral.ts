import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


interface DownloadPayload {
  id: number;
  fileName?: string;
}

interface DownloadResponse {
  data: Blob;
  filename?: string;
}

interface UseDownloadGeneralOptions {
  endpoint?: string;
  customFilename?: string;
  onSuccess?: (data: DownloadResponse) => void;
  onError?: (error: Error) => void;
  onSettled?: (data: DownloadResponse | undefined, error: Error | null) => void;
}

const useDownloadGeneral = (
  options?: UseDownloadGeneralOptions & Partial<UseMutationOptions<DownloadResponse, Error, DownloadPayload>>
) => {
  const {
    endpoint = 'bucketDocument.document.downloadDocumentGroup',
    customFilename,
    onSuccess,
    onError,
    onSettled,
    ...mutationOptions
  } = options || {};

  const mutation = useMutation({
    mutationFn: async (payload: DownloadPayload) => {
      try {
        console.log('Downloading document with payload:', payload);

        const response = await API(endpoint, {
          data: payload,
          responseType: 'blob',
        });

        // Create a blob URL for download
        const blob = new Blob([response.data], {
          type: response.headers['content-type'] || 'application/octet-stream',
        });

        // Extract filename from headers or use custom filename or default
        let filename = 'download';

        // Try to get Content-Disposition header using direct property access
        let contentDisposition = null;

        // Try direct property access with different cases
        if (response.headers['content-disposition']) {
          contentDisposition = response.headers['content-disposition'];
        } else if (response.headers['Content-Disposition']) {
          contentDisposition = response.headers['Content-Disposition'];
        }

        // Try to get filename from Content-Disposition header first
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          console.log('Filename match:', filenameMatch);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
            console.log('Extracted filename:', filename);
          }
        }

        // Use custom filename if provided and not empty, otherwise keep the extracted filename
        if (customFilename && customFilename.trim() !== '') {
          filename = customFilename;
        } else if (payload.fileName && payload.fileName.trim() !== '') {
          filename = payload.fileName;
        }

        console.log('Final filename to be used:', filename);

        // Create download link and trigger download
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
        console.error('Download API error:', error);
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

export default useDownloadGeneral;

/* penggunaan dengan object parameter

default bawaan endpoint
import useDownloadGeneral from '@/hooks/useDownloadGeneral';

const MyComponent = () => {
  const downloadMutation = useDownloadGeneral();

  const handleDownload = () => {
    downloadMutation.mutate({ id: 66 });
  };

  return (
    <button onClick={handleDownload}>
      Download Document
    </button>
  );
};

change url endpoint
import useDownloadGeneral from '@/hooks/useDownloadGeneral';

const MyComponent = () => {
  const downloadMutation = useDownloadGeneral({
    endpoint: 'bucketDocument.someOtherEndpoint.downloadSomething'
  });

  const handleDownload = () => {
    downloadMutation.mutate({ id: 66 });
  };

  return (
    <button onClick={handleDownload}>
      Download Custom Document
    </button>
  );
};

with custom filename
import useDownloadGeneral from '@/hooks/useDownloadGeneral';

const MyComponent = () => {
  const downloadMutation = useDownloadGeneral({
    endpoint: 'bucketDocument.draftMemo.downloadDraftMemo',
    customFilename: 'my-custom-filename.pdf'
  });

  const handleDownload = () => {
    downloadMutation.mutate({ id: 66 });
  };

  return (
    <button onClick={handleDownload}>
      Download with Custom Filename
    </button>
  );
};

with success and error handlers
import useDownloadGeneral from '@/hooks/useDownloadGeneral';

const MyComponent = () => {
  const downloadMutation = useDownloadGeneral({
    endpoint: 'bucketDocument.draftMemo.downloadDraftMemo',
    customFilename: 'draft-memo.pdf',
    onSuccess: (data) => {
      console.log('Download successful:', data);
      // Handle success
    },
    onError: (error) => {
      console.error('Download failed:', error);
      // Handle error
    }
  });

  const handleDownload = () => {
    downloadMutation.mutate({ id: 66 });
  };

  return (
    <button onClick={handleDownload}>
      Download with Handlers
    </button>
  );
};

*/
