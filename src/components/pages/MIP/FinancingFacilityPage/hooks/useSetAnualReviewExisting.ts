import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface payloadUpdateAnualReviewMip {
  id?: number;
  annualReview?: boolean;
  module?: string;
  process?: string;
  bucketProcessId?: string;
  facilityId?: string;
}

const useSetAnnualReviewExisting = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: payloadUpdateAnualReviewMip) => {
      const res = await API('bucket.financingFacilityAnnualReview.updateExisting', {
        data: payload,
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: ['financingFacilitiesExisting']});
      queryClient.invalidateQueries({ queryKey: ['financingFacilityExisting', { id: variables?.id }]});
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  return mutation;
};

export default useSetAnnualReviewExisting;
