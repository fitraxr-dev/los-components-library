import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useBmppCalculationMaster = ({
  onSuccess = () => {},
  onError = (data: any) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, unknown, any>({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling API (master) with payload:', payload);
        const response = await API('master.bmpp.calculate', {
          data: payload,
        });
        console.log('API response (master):', response);
        return response?.data;
      } catch (error) {
        console.error('API error (master):', error);
        throw error;
      }
    },
    onError: (data) => {
      onError(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          'master-bmpp-groups',
          {
            bmppType: variables.bmppType,
            bucketProcessId: variables.bucketProcessId,
            groupId: variables.groupId ?? null,
            module: variables.module,
            process: variables.process,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          'master-bmpp-summary-list',
          {
            filter: {
              bucketProcessId: variables.bucketProcessId,
              module: variables.module,
              process: variables.process,
            },
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          'debtor-group-proposal-list',
          {
            bucketProcessId: variables.bucketProcessId,
            module: variables.module,
            process: variables.process,
          },
        ],
      });

      queryClient.invalidateQueries({
        queryKey: [
          'debtor-proposal-list',
          {
            bucketProcessId: variables.bucketProcessId,
            debtorId: variables.debtorId,
            module: variables.module,
            process: variables.process,
          },
        ],
      });

      onSuccess();
    },
  });

  return mutation;
};

export default useBmppCalculationMaster;
