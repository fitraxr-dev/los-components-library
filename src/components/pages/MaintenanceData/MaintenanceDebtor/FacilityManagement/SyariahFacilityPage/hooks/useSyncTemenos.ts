import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface PayloadSyncTemenos {
  cif: string;
}

const useSyncTemenos = ({
  onSuccess,
  onError,
}) => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: async (payload: PayloadSyncTemenos) => {
      const res = await API('master.facilityManagementSyariahExisiting.syncTemenos', {
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
      queryClient.invalidateQueries({ queryKey: ['syariah-data-as-of']});
      queryClient.invalidateQueries({ queryKey: ['syariah-existing-list']});
      onSuccess?.(data, variables, context);
    },
  });
  return query;
};
export default useSyncTemenos;
