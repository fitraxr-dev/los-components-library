import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


export interface CopyRatingPayload {
  sourceBucketProcessId?: string | null;
  targetBucketProcessId: string;
  sourceDigitalMemo: string;
  sourceMemoDate?: string;
  annualReviewId?: string;
  ratingId?: string;
}

const useCopyRating = (
  config?: Partial<UseMutationOptions<any, any, CopyRatingPayload>>
) => {
  const mutation = useMutation<any, any, CopyRatingPayload>({
    mutationFn: async (payload: CopyRatingPayload) => {
      const res = await API('mip.rating.copyRating', {
        data: payload,
      });
      return res.data;
    },
    ...config,
  });

  return mutation;
};

export default useCopyRating;
