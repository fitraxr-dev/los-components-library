import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveFinancingFacility = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      console.log('123', payload);
      try {
        const res = await API('bucket.financialFacility.save', {
          data: payload,
        });
        return res.data;
      } catch (error) {
        console.error('Error saving financing facility:', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      // invalidate query biar data terbaru langsung ke-fetch
      queryClient.invalidateQueries({ queryKey: ['financing-facility-detail']});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-all-existing']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveFinancingFacility;
