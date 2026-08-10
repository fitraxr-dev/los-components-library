import React, { useState } from 'react';

import useDownloadGeneral from './useDownloadGeneral';

// Example component showing different ways to use useDownloadGeneral
const DownloadExample: React.FC = () => {
  const [downloadStatus, setDownloadStatus] = useState<string>('');

  // Example 1: Basic usage with fallback handlers
  const basicDownload = useDownloadGeneral();

  // Example 2: Custom endpoint with fallback handlers
  const customEndpointDownload = useDownloadGeneral({
    endpoint: 'bucketDocument.document.downloadDocumentGroup',
  });

  // Example 3: Custom endpoint and filename with fallback handlers
  const customFilenameDownload = useDownloadGeneral({
    customFilename: 'draft-memo-custom.pdf',
    endpoint: 'bucketDocument.document.downloadDocumentGroup',
  });

  // Example 4: With explicit onSuccess and onError handlers
  const explicitHandlersDownload = useDownloadGeneral({
    customFilename: 'explicit-handlers.pdf',
    endpoint: 'bucketDocument.document.downloadDocumentGroup',
    onError: (error) => {
      console.error('Download failed:', error);
      setDownloadStatus('Download failed! Please try again.');
      // You can add additional error handling here
      // e.g., show error toast, retry logic, etc.
    },
    onSuccess: (data) => {
      console.log('Download successful:', data);
      setDownloadStatus('Download completed successfully!');
      // You can add additional success logic here
      // e.g., show toast notification, update UI, etc.
    },
  });

  // Example 5: With loading state handling
  const loadingStateDownload = useDownloadGeneral({
    customFilename: 'loading-example.pdf',
    endpoint: 'bucketDocument.document.downloadDocumentGroup',
    onError: () => {
      setDownloadStatus('Download failed with loading state!');
    },
    onSuccess: () => {
      setDownloadStatus('Download completed with loading state!');
    },
  });

  const handleBasicDownload = () => {
    setDownloadStatus('Starting basic download...');
    basicDownload.mutate({ id: 66 });
  };

  const handleCustomEndpointDownload = () => {
    setDownloadStatus('Starting custom endpoint download...');
    customEndpointDownload.mutate({ id: 67 });
  };

  const handleCustomFilenameDownload = () => {
    setDownloadStatus('Starting custom filename download...');
    customFilenameDownload.mutate({ id: 68 });
  };

  const handleExplicitHandlersDownload = () => {
    setDownloadStatus('Starting explicit handlers download...');
    explicitHandlersDownload.mutate({ id: 69 });
  };

  const handleLoadingStateDownload = () => {
    setDownloadStatus('Starting loading state download...');
    loadingStateDownload.mutate({ id: 70 });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h2>useDownloadGeneral Examples</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>Download Status:</h3>
        <p
          style={{
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            minHeight: '20px',
            padding: '10px',
          }}
        >
          {downloadStatus || 'No download activity'}
        </p>
      </div>

      <div style={{ display: 'grid', gap: '10px', maxWidth: '600px' }}>
        {/* Example 1: Basic usage */}
        <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
          <h4>1. Basic Usage (Default handlers)</h4>
          <p>Uses default endpoint and filename with fallback success/error handling</p>
          <button
            onClick={handleBasicDownload}
            disabled={basicDownload.isPending}
            style={{
              backgroundColor: basicDownload.isPending ? '#ccc' : '#007bff',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: basicDownload.isPending ? 'not-allowed' : 'pointer',
              padding: '8px 16px',
            }}
          >
            {basicDownload.isPending ? 'Downloading...' : 'Basic Download'}
          </button>
          {basicDownload.isError && (
            <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
              Error: {basicDownload.error?.message}
            </p>
          )}
        </div>

        {/* Example 2: Custom endpoint */}
        <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
          <h4>2. Custom Endpoint</h4>
          <p>Uses custom endpoint with fallback handlers</p>
          <button
            onClick={handleCustomEndpointDownload}
            disabled={customEndpointDownload.isPending}
            style={{
              backgroundColor: customEndpointDownload.isPending ? '#ccc' : '#28a745',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: customEndpointDownload.isPending ? 'not-allowed' : 'pointer',
              padding: '8px 16px',
            }}
          >
            {customEndpointDownload.isPending ? 'Downloading...' : 'Custom Endpoint Download'}
          </button>
        </div>

        {/* Example 3: Custom filename */}
        <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
          <h4>3. Custom Filename</h4>
          <p>Uses custom endpoint and filename with fallback handlers</p>
          <button
            onClick={handleCustomFilenameDownload}
            disabled={customFilenameDownload.isPending}
            style={{
              backgroundColor: customFilenameDownload.isPending ? '#ccc' : '#ffc107',
              border: 'none',
              borderRadius: '4px',
              color: 'black',
              cursor: customFilenameDownload.isPending ? 'not-allowed' : 'pointer',
              padding: '8px 16px',
            }}
          >
            {customFilenameDownload.isPending ? 'Downloading...' : 'Custom Filename Download'}
          </button>
        </div>

        {/* Example 4: Explicit handlers */}
        <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
          <h4>4. Explicit Success/Error Handlers</h4>
          <p>Uses explicit onSuccess and onError handlers</p>
          <button
            onClick={handleExplicitHandlersDownload}
            disabled={explicitHandlersDownload.isPending}
            style={{
              backgroundColor: explicitHandlersDownload.isPending ? '#ccc' : '#dc3545',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: explicitHandlersDownload.isPending ? 'not-allowed' : 'pointer',
              padding: '8px 16px',
            }}
          >
            {explicitHandlersDownload.isPending ? 'Downloading...' : 'Explicit Handlers Download'}
          </button>
        </div>

        {/* Example 5: Loading state */}
        <div style={{ border: '1px solid #ddd', borderRadius: '4px', padding: '15px' }}>
          <h4>5. Loading State Handling</h4>
          <p>Shows how to handle loading states with custom handlers</p>
          <button
            onClick={handleLoadingStateDownload}
            disabled={loadingStateDownload.isPending}
            style={{
              backgroundColor: loadingStateDownload.isPending ? '#ccc' : '#6f42c1',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: loadingStateDownload.isPending ? 'not-allowed' : 'pointer',
              padding: '8px 16px',
            }}
          >
            {loadingStateDownload.isPending ? 'Downloading...' : 'Loading State Download'}
          </button>
        </div>
      </div>

      {/* Status indicators */}
      <div style={{ backgroundColor: '#f8f9fa', borderRadius: '4px', marginTop: '20px', padding: '15px' }}>
        <h4>Mutation States:</h4>
        <div style={{ display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div>
            <strong>Basic:</strong> {basicDownload.isPending ? '⏳ Pending' : basicDownload.isSuccess ? '✅ Success' : basicDownload.isError ? '❌ Error' : '⏸️ Idle'}
          </div>
          <div>
            <strong>Custom Endpoint:</strong> {customEndpointDownload.isPending ? '⏳ Pending' : customEndpointDownload.isSuccess ? '✅ Success' : customEndpointDownload.isError ? '❌ Error' : '⏸️ Idle'}
          </div>
          <div>
            <strong>Custom Filename:</strong> {customFilenameDownload.isPending ? '⏳ Pending' : customFilenameDownload.isSuccess ? '✅ Success' : customFilenameDownload.isError ? '❌ Error' : '⏸️ Idle'}
          </div>
          <div>
            <strong>Explicit Handlers:</strong> {explicitHandlersDownload.isPending ? '⏳ Pending' : explicitHandlersDownload.isSuccess ? '✅ Success' : explicitHandlersDownload.isError ? '❌ Error' : '⏸️ Idle'}
          </div>
          <div>
            <strong>Loading State:</strong> {loadingStateDownload.isPending ? '⏳ Pending' : loadingStateDownload.isSuccess ? '✅ Success' : loadingStateDownload.isError ? '❌ Error' : '⏸️ Idle'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadExample;
