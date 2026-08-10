import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TypeProcess } from '@/enums/Module';
import { API } from '@/helpers/api';

import type { ReAssignmentListRequestDto } from './useSaveReassignPic.types';


const useSaveReassignPic = ({
  onSuccess = (variables: any) => {},
  onError = (variable: any) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ReAssignmentListRequestDto) => {
      const res = await API('bucket.assignment.reAssign', {
        data: payload,
      });

      return res.data;
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: (_, variables) => {
      const process = (variables.process === 'SPDP' || variables.process === 'SPFP_FINAL')
        ? `${TypeProcess.SPDP}|${TypeProcess.SPFP_FINAL}`
        : variables.process;

      queryClient.invalidateQueries({
        queryKey: ['bucket-list', {
          filter: {
            module: variables.module,
            process: process,
          },
        }],
      });
      onSuccess(variables);
    },
  });
  return mutation;
};

export default useSaveReassignPic;
