import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useDownloadWatermark = ({
  onSuccess = (response: any, variable: any) => {},
  onError = (e: any) => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const { api, ...data } = payload;
      const url = api ?? 'bucketDocument.document.downloadWithWatermark';
      const res = await API(url, {
        data: data,
        responseType: 'blob',
      });
      return {
        ...res,
        filename: payload.filename || payload.fileName,
      };
    },
    onError: (e) => {
      onError(e);
    },
    onSuccess: (response, variable) => {
      onSuccess(response, variable);
      queryClient.invalidateQueries({ queryKey: ['maintenance-document-list']});
    },
  });

  return mutation;
};


export default useDownloadWatermark;
