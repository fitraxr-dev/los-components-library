import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { BmppDetailRequestDto } from '../TabBmppCalculation.types';


const useBmppCalculationMaster = ({
  onSuccess = () => {},
  onError = (data) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: BmppDetailRequestDto) => {
      const res = await API('master.bmpp.simulationCalculate', {
        data: payload,
      });

      return res.data;
    },
    onError: (data) => {
      onError(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['master-bmpp-groups', {
        bmppType: variables.bmppType,
        bucketProcessId: variables.bucketProcessId,
        groupId: variables.groupId ?? null,
        module: variables.module,
        process: variables.process,
      }]});
      queryClient.invalidateQueries({ queryKey: ['master-bmpp-summary-list', {
        filter: {
          bucketProcessId: variables.bucketProcessId,
          module: variables.module,
          process: variables.process,
        },
      }]});
      queryClient.invalidateQueries({ queryKey: ['debtor-group-proposal-list', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      queryClient.invalidateQueries({ queryKey: ['debtor-proposal-list', {
        bucketProcessId: variables.bucketProcessId,
        debtorId: variables.debtorId,
        module: variables.module,
        process: variables.process,
      }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useBmppCalculationMaster;
