import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


export interface SaveParameterCOTEODRequest{
  id?: number;
  bucketProcessId?: string;
  process?: string;
  cutOffTime?: string;
  endOfDay?: string;
  isActive?: boolean;
  eodDate?: string;
}
export interface SaveParameterCOTEODResponse {
  content: {
    id: number;
    bucketProcessId: string;
    process: string;
    isActive: boolean;
    createDate: string;
    createBy: string;
    modifiedDate: string;
    modifiedBy: string;
    isEditable: boolean;
  };
}
type UseSaveParameterCOTEODDetailProps =
  UseMutationOptions<SaveParameterCOTEODResponse, Error, SaveParameterCOTEODRequest>

const useSaveParameterCOTEODDetail = (kind: 'COT' | 'EOD', { onSuccess, ...queryOptions }: UseSaveParameterCOTEODDetailProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveParameterCOTEODRequest) => {
      const endpoint = kind === 'COT' ? 'parameter.parameterCotEod.cotStore' : 'parameter.parameterCotEod.eodStore';
      const res = await API(endpoint, {
        data: payload,
      });

      return res.data?.data;
    },
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: [`parameter-${kind.toLowerCase()}`, 'detail', 'summary']});
      onSuccess?.(data, variables, ctx);
    },
    ...queryOptions,
  });

  return mutation;
};

export default useSaveParameterCOTEODDetail;
