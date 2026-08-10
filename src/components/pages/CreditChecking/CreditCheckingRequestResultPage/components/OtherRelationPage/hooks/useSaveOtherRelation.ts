import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


interface SaveOtherRelationRequest {
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
  identityNo?: string;
  identityType?: string;
  shares?: string;
  valuePerShare?: string;
  percentage?: number;
  value?: string;
  type?: string;
  jobPosition?: string;
  typeDescription?: string;
}

interface SaveOtherRelationResponse {
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
type UseSaveOtherRelationDetailProps =
  UseMutationOptions<SaveOtherRelationResponse, Error, SaveOtherRelationRequest>

const useSaveOtherRelation = (queryOptions?: UseSaveOtherRelationDetailProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveOtherRelationRequest) => {
      const res = await API('creditChecking.result.saveOtherRelated', {
        data: payload,
      });

      return res.data?.data;
    },
    ...queryOptions,
    onError: (error, variables, context) => {
      queryOptions?.onError?.(error, variables, context);
    },
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ['credit-checking', 'other-related']});
      queryOptions?.onSuccess?.(data, variables, ctx);
    },
  });

  return mutation;
};

export default useSaveOtherRelation;
