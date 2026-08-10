import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


/**
 * Hook untuk preview dokumen dengan watermark menggunakan endpoint previewWatermark
 * @param onSuccess - Callback function yang dipanggil ketika preview berhasil
 * @param onError - Callback function yang dipanggil ketika preview gagal
 * @returns Mutation object dari react-query untuk preview watermark
 */
const usePreviewWatermark = ({
  onSuccess = (variable: any) => {},
  onError = (e) => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: DownloadDocumentWatermarkRequestDto) => {
      const res = await API('bucketDocument.document.previewWatermark', {
        data: payload,
        method: 'post',
      });

      return res.data;
    },
    onError: (e) => {
      onError(e);
    },
    onSuccess: (response, variable) => {
      onSuccess(response);
    },
  });

  return mutation;
};

export default usePreviewWatermark;


interface DownloadDocumentWatermarkRequestDto {
  /**
     *
     * @type {number}
     * @memberof DownloadDocumentWatermarkRequestDto
     */
  documentId?: number;
  /**
   *
   * @type {string}
   * @memberof DownloadDocumentWatermarkRequestDto
   */
  documentExtension?: string;
  /**
   *
   * @type {string}
   * @memberof DownloadDocumentWatermarkRequestDto
   */
  fileName?: string;
  /**
   *
   * @type {string}
   * @memberof DownloadDocumentWatermarkRequestDto
   */
  watermark?: string;
}
