import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


const useDownloadWatermark = ({ onSuccess, ...config }: UseMutationOptions<any, any, any>) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('bucketDocument.document.downloadWithWatermark', {
        data: payload,
        method: 'post',
      });

      return res.data;
    },
    onSuccess: (data: any, variables: any, ctx: any) => {
      onSuccess?.(data, variables, ctx);
      queryClient.invalidateQueries({ queryKey: ['maintenance-document-list']});
    },
    ...config,
  });

  return mutation;
};


export default useDownloadWatermark;
