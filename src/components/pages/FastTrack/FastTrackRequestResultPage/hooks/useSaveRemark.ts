import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


export interface SaveRemarkRequest {
  bucketProcessId: string;
  section: string;
  remark: string;
}

export interface SaveRemarkResponse {
  content: any;
}

type UseSaveRemarkProps = UseMutationOptions<SaveRemarkResponse, Error, SaveRemarkRequest>;

const useSaveRemark = (queryOptions?: UseSaveRemarkProps) => {
  const mutation = useMutation({
    mutationFn: async (payload: SaveRemarkRequest) => {
      const res = await API('bucket.fastTrack.saveRemark', {
        data: payload,
      });
      return res.data;
    },
    onError: (err, vars, ctx) => {
      queryOptions?.onError?.(err, vars, ctx);
    },
    onSuccess: (data, variables, ctx) => {
      queryOptions?.onSuccess?.(data, variables, ctx);
    },
  });

  return mutation;
};

export default useSaveRemark;
