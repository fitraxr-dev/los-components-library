import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


interface SaveDebtorRequest {
  id: number;
  referenceCode: string;
  bucketProcessId: string;
  name: string;
  npwp: string;
  collectability: string;
  resultReporting: string;
  note: string;
  googleResult: string;
  ref: string;
}

interface SaveDebtorResponse {
  content?: {
    id?: number;
    bucketProcessId?: string;
    name?: string;
    npwp?: string;
    type?: string;
    typeLabel?: string;
    detail?: Array<{
      id?: number;
      collectability?: string;
      collectabilityLabel?: string;
      resultReporting?: string;
      note?: string;
      googleResult?: string;
      ref?: string;
    }>;
    lastCheckedDate?: string;
    completedDate?: string;
    createdDate?: string;
    modifiedDate?: string;
  };
}
type UseSaveDebtorDetailProps =
  UseMutationOptions<SaveDebtorResponse, Error, SaveDebtorRequest>

const useSaveDebtor = (queryOptions?: UseSaveDebtorDetailProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveDebtorRequest) => {
      const res = await API('fastTrack.result.saveDebtor', {
        data: payload,
      });

      return res.data?.data;
    },
    ...queryOptions,
    onError: (error, variables, context) => {
      queryOptions?.onError?.(error, variables, context);
    },
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ['fast-track', 'debtor']});
      queryOptions?.onSuccess?.(data, variables, ctx);
    },
  });

  return mutation;
};

export default useSaveDebtor;
