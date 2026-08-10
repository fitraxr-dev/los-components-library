import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


type Payload = {
  bucketProcessId: string;
  module: string;
  process: string;
}

const useApplyFinancingFacilityDiff = ({
  onError = () => {},
  onSuccess = () => {},
}: { onError?: () => void; onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: Payload) => {
      const res = await API('bucket.financialFacility.applyDiff', {
        data: payload,
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financing-facility-check-diff']});
      onSuccess();
    },
  });

  return mutation;
};

export default useApplyFinancingFacilityDiff;
