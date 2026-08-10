import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSubmitBmppCalculate = ({
  onSuccess = () => {},
  onError = (data: any) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, unknown, any>({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling API with payload:', payload);
        const response = await API('mip.bmpp.calculate', {
          data: payload,
        });
        console.log('API response:', response);
        return response?.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    onError: (data) => {
      onError(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          'bmpp-groups',
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
          'bmpp-summary-list',
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

export default useSubmitBmppCalculate;
