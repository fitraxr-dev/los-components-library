import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ReviewControllerApi } from '@/services/openapi/lpa-service';


const api = new ReviewControllerApi();

const useSaveReviewDetail = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ReviewDetailpayload) => {
      const { bucketProcessId, process, module, description } = payload;
      const res = await api.saveReview(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['lpa-detail']});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-list']});
      await onSuccess();
    },
  });

  return mutation;
};

type ReviewDetailpayload = {
  bucketProcessId: string;
  process: string;
  module: string;
  description?: any;
};

export default useSaveReviewDetail;
