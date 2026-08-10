import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';

import { TimelineControllerApi } from '@/services/openapi/bucket-service';

import type { SaveTimelineRequestDto } from '@/services/openapi/bucket-service';


const api = new TimelineControllerApi();
const useCommentVa = (options: any = {}) => {
  const mutation = useMutation({
    // mutationFn sekarang menerima payload langsung dengan tipe SaveVARequest
    mutationFn: async (saveVARequest: SaveTimelineRequestDto) => {
      const res = await api.saveHistory(saveVARequest);
      return res.data;
    },
    // Gunakan onError dan onSuccess dari options
    onError: options.onError,
    onSuccess: options.onSuccess,
  });

  return mutation;
};


export default useCommentVa;
