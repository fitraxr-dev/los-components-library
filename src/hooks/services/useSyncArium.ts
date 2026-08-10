import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface PayloadSyncArium {
  cif: string;
}

const useSyncArium = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: PayloadSyncArium, context: any) => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: async (payload: PayloadSyncArium) => {
      const res = await API('master.facilityConventional.syncArium', {
        data: payload,
      });

      return res.data?.data;
    },
    onError: (error: any) => {
      console.error('=== MUTATION ERROR ===', error);
      onError?.(error);
    },
    onSuccess: (data, variables, context) => {
      console.log('=== SUCCESS ===', data);
      queryClient.invalidateQueries({ queryKey: ['maintenance-konven-existing-list']});
      onSuccess?.(data, variables, context);
    },
  });
  return query;
};

export default useSyncArium;
