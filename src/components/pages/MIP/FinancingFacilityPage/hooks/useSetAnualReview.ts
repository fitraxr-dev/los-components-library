import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { FinancingFacilityAnnualReviewRequestDto } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useSetAnnualReview = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: FinancingFacilityAnnualReviewRequestDto) => {
      const res = await api.updateFinancingFacilityAnnualReview(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['financingFacilitiesExisting']});
      queryClient.invalidateQueries({ queryKey: ['financingFacilityExisting', { id: variables?.id }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSetAnnualReview;
