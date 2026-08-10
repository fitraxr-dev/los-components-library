import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { ActivityType } from '@/enums/Activity';
import { API } from '@/helpers/api';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCheckFileDokument, { XLSX_ONLY_MIME_TYPES } from '@/hooks/useCheckFileDokument';
import useRecordLog from '@/hooks/useRecordLog';


type UseTemplateDocumentSectionProps = {
  onUploadComplete?: () => void;
};

export const useTemplateDocumentSection = ({ onUploadComplete }: UseTemplateDocumentSectionProps = {}) => {
  const [templateFile, setTemplateFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { recordActivity } = useRecordLog();
  const queryClient = useQueryClient();

  // Use XLSX ONLY preset for template validation
  const { validateFile } = useCheckFileDokument({
    acceptableMimeTypes: XLSX_ONLY_MIME_TYPES,
    // maxFileSizeBytes: 100 * 1024 * 1024, // 100MB
  });

  const handleFileChange = (file: any) => {
    // If no file selected, just clear the template file
    if (!file) {
      setTemplateFile(null);
      return;
    }

    // Validate file if it exists using XLSX ONLY preset
    const validation = validateFile(file);
    if (!validation.isValid) {
      // Show specific error message to user using nice modal
      showNiceModalV2({
        title: validation.errorMessage,
        type: 'error',
      });
      return;
    }

    // File is valid, set it
    setTemplateFile(file);
  };

  const handleDownloadTemplate = async () => {
    try {
      // Record activity for download template
      recordActivity({
        activity: ActivityType.DOWNLOAD,
        menuCode: 'parameter-lov',
        process: 'parameter-lov',
        remarks: 'download parameter lov template',
      });

      // Call download template API
      const response = await API('parameter.parameterLov.downloadTemplate', {
        method: 'GET',
        responseType: 'blob', // Important for file download
      });

      // Create blob URL and trigger download
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'parameter-lov-template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success popup
      showNiceModalV2({
        title: 'Template berhasil didownload',
        type: 'success',
      });

    } catch (error) {
      console.error('Download template error:', error);

      // Show error popup
      showNiceModalV2({
        title: 'Download template gagal',
        type: 'error',
      });
    }
  };

  const handleUploadTemplate = async () => {
    if (!templateFile || !templateFile.file) {
      showNiceModalV2({
        title: 'File tidak ditemukan',
        type: 'error',
      });
      return;
    }

    // Prevent double click by checking if already uploading
    if (isUploading) {
      return;
    }

    setIsUploading(true);

    try {
      // Record activity for upload template
      recordActivity({
        activity: ActivityType.CREATE,
        changeAfter: JSON.stringify({
          fileName: templateFile.file.name,
          fileSize: templateFile.file.size,
          fileType: templateFile.file.type,
        }),
        changeBefore: null,
        menuCode: 'parameter-lov',
        process: 'parameter-lov',
        remarks: `upload parameter lov template: ${templateFile.file.name}`,
      });

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', templateFile.file);

      // Call upload template API
      const response = await API('parameter.parameterLov.importTemplate', {
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Show success message
      showNiceModalV2({
        onClose: onUploadComplete,
        title: 'File berhasil diupload',
        type: 'success',
      });

      // Invalidate queries to refresh table data
      await queryClient.invalidateQueries({
        queryKey: ['parameter-lov-list'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['parameter-lov-history-list'],
      });

      // Clear the selected file after successful upload
      setTemplateFile(null);

    } catch (error: any) {
      console.error('Upload template error:', error);

      // Extract error message from backend response
      // API interceptor transforms error to { data, message, status } structure
      const errorMessage =
        error?.message ||
        'Upload file gagal';

      // Show error message from backend
      showNiceModalV2({
        onClose: onUploadComplete,
        title: errorMessage,
        type: 'error',
      });

      // Invalidate history list query to refresh table (backend may record failed upload in history)
      await queryClient.invalidateQueries({
        queryKey: ['parameter-lov-list'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['parameter-lov-history-list'],
      });
    } finally {
      // Always reset loading state
      setIsUploading(false);
    }
  };

  return {
    handleDownloadTemplate,
    handleFileChange,
    handleUploadTemplate,
    isUploading,
    setTemplateFile,
    templateFile,
  };
};

export default useTemplateDocumentSection;
