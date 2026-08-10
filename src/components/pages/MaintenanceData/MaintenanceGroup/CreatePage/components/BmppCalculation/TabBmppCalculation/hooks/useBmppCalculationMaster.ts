import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SimulationBmppControllerApi } from '@/services/openapi/master-service';

import type { BmppDetailRequestDto } from '@/services/openapi/master-service';


const api = new SimulationBmppControllerApi();

const useBmppCalculationMaster = ({
  onSuccess = () => {},
  onError = (data) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: BmppDetailRequestDto) => {
      const res = await api.calculateBmpp(payload);

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
