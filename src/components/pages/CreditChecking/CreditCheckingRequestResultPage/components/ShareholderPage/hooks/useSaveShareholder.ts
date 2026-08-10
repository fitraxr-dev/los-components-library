import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


interface SaveShareholderRequest {
  id?: number;
  referenceCode: string;
  bucketProcessId: string;
  name: string;
  npwp: string;
  collectability: string;
  resultReporting: string;
  note: string;
  googleResult: string;
  ref: string;
  identityNo?: string;
  identityType?: string;
  shares?: string;
  valuePerShare?: string;
  percentage?: number;
  value?: string;
  type?: string;
}
interface SaveShareholderResponse {
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
type UseSaveShareholderDetailProps =
  UseMutationOptions<SaveShareholderResponse, Error, SaveShareholderRequest>

const useSaveShareholder = (queryOptions?: UseSaveShareholderDetailProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveShareholderRequest) => {
      const res = await API('creditChecking.result.saveShareholder', {
        data: payload,
      });

      return res.data?.data;
    },
    ...queryOptions,
    onError: (error, variables, context) => {
      queryOptions?.onError?.(error, variables, context);
    },
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ['credit-checking', 'shareholder']});
      queryOptions?.onSuccess?.(data, variables, ctx);
    },
  });

  return mutation;
};

export default useSaveShareholder;
