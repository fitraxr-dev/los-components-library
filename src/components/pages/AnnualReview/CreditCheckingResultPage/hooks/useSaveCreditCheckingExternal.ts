import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveCreditCheckingExternal = ({
  onSuccess = (data: any) => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: CreditCheckingExternalDto) => {
      const {
        bucketProcessId,
        process,
        module,
        ratingResult,
        ratingDescription,
        ratingLongDescription,
        creditMarketCheckingCollectability,
        creditMarketCheckingRestructurisation,
        creditMarketCheckingReference,
        description,
      } = payload;

      const res = await API('mip.creditChecking.creditCheckingExternalSave', {
        data: {
          bucketProcessId,
          creditMarketCheckingCollectability,
          creditMarketCheckingReference,
          creditMarketCheckingRestructurisation,
          description,
          module,
          process,
          ratingDescription,
          ratingLongDescription,
          ratingResult,
        },
      });

      return res.data;
    },
    onError: () => {
      onError();
    },

    onSuccess: (_, variables) => {

      queryClient.invalidateQueries({ queryKey: ['external-rating']});
      onSuccess(variables);
    },
  });

  return mutation;
};

type CreditCheckingExternalDto = {
  bucketProcessId: string;
  process: string;
  module: string;
  ratingResult?: string;
  ratingDescription?: string;
  ratingLongDescription?: string;
  creditMarketCheckingCollectability?: boolean;
  creditMarketCheckingRestructurisation?: boolean;
  creditMarketCheckingReference?: string;
  description?: any;
}
export default useSaveCreditCheckingExternal;
