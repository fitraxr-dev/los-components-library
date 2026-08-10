import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


export interface SaveParameterRateRequest{
  id?: number;
  bucketProcessId?: string;
  exchangeRate?: number;
  ariumCode?: string;
  temenosCode?: string;
  isActive?: boolean;
}
export interface SaveParameterRateResponse {
  content: {
    id: number;
    bucketProcessId: string;
    currency: string;
    exchangeRate: string;
    ariumCode: string;
    temenosCode: string;
    isActive: boolean;
    modifiedBy: string;
    modifiedDate: string;
    status: string | null;
    statusLabel: string | null;
  };
}
type UseSaveParameterRateDetailProps =
  UseMutationOptions<SaveParameterRateResponse, Error, SaveParameterRateRequest>

const useSaveParameterRateDetail = ({ onSuccess, ...queryOptions }: UseSaveParameterRateDetailProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveParameterRateRequest) => {
      const res = await API('parameter.parameterRate.store', {
        data: {
          ...payload,
          exchangeRate: Math.trunc(payload.exchangeRate),
        },
      });

      return res.data?.data;
    },
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ['parameter-rate']});
      onSuccess?.(data, variables, ctx);
    },
    ...queryOptions,
  });

  return mutation;
};

export default useSaveParameterRateDetail;
