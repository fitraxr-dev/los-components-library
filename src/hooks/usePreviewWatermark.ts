import { useMutation, useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
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
      queryClient.invalidateQueries({ queryKey: ['maintenance-document-list']});
    },
  });

  return mutation;
};

export default usePreviewWatermark;
