import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { FinancingFacilityAnnualReviewRequestDto } from '../FinancingFacility.type';


const useSetAnnualReview = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: FinancingFacilityAnnualReviewRequestDto) => {
      const res = await API('bucket.financingFacilityAnnualReview.update', {
        data: payload,
      });

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
