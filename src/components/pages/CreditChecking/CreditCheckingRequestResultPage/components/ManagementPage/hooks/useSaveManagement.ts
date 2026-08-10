import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


interface SaveManagementRequest {
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
}

interface SaveManagementResponse {
  content?: {
    id?: number;
    bucketProcessId?: string;
    name?: string;
    npwp?: string;
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
type UseSaveManagementDetailProps =
  UseMutationOptions<SaveManagementResponse, Error, SaveManagementRequest>

const useSaveManagement = (queryOptions?: UseSaveManagementDetailProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveManagementRequest) => {
      const res = await API('creditChecking.result.saveManagement', {
        data: payload,
      });

      return res.data?.data;
    },
    ...queryOptions,
    onError: (error, variables, context) => {
      queryOptions?.onError?.(error, variables, context);
    },
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ['credit-checking', 'management']});
      queryOptions?.onSuccess?.(data, variables, ctx);
    },
  });

  return mutation;
};

export default useSaveManagement;
