import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface PayloadUpdateCustomerBanding {
  bucketProcessId: string;
  module: string;
  process: string;
  noDraft: string;
  isCustomerBanding: boolean;
}

const useUpdateCustomerBanding = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: PayloadUpdateCustomerBanding, context: unknown) => void;
  onError?: (error: any) => void;
} = {}) => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: async (payload: PayloadUpdateCustomerBanding) => {
      const res = await API('agreement.offeringLetter.updateCustomerBanding', {
        data: payload,
      });

      return res.data?.data;
    },
    onError: (error: any) => {
      onError?.(error);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['upload-offering-letter-list']});
      onSuccess?.(data, variables, context);
    },
  });
  return query;
};

export default useUpdateCustomerBanding;
