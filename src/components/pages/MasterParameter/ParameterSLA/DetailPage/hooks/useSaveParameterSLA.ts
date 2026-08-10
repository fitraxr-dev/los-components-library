import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


export interface SaveParameterSLARequest {
  id: number;
  bucketProcessId?: number | null;
  isActive: boolean;
  slaDeadline: number;
}
export interface SaveParameterSLAResponse {
  content: {
    id: number;
    bucketProcessId: string;
    stage: string;
    slaDeadline: number;
    isActive: boolean;
    module: string;
    process: string;
    groupDivision: string;
    keterangan: string;
    createDate: string;
    createBy: string;
    modifiedDate: string;
    modifiedBy: string;
    moduleLabel: string;
    processLabel: string;
  };
}
type UseSaveParameterSLADetailProps =
  UseMutationOptions<SaveParameterSLAResponse, Error, SaveParameterSLARequest>

const useSaveParameterSLADetail = ({ onSuccess, ...queryOptions }: UseSaveParameterSLADetailProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveParameterSLARequest) => {
      const res = await API('parameter.parameterSla.store', {
        data: payload,
      });

      return res.data?.data;
    },
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ['parameter-sla-detail']});
      onSuccess?.(data, variables, ctx);
    },
    ...queryOptions,
  });

  return mutation;
};

export default useSaveParameterSLADetail;
