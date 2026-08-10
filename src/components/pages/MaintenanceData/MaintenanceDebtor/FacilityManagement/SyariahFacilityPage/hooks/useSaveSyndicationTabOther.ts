import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveSyndicationTabOther = ({
  onSuccess,
  onError,
}) => {
  const queryClient = useQueryClient();
  const query = useMutation({
    mutationFn: async (payload: any) => {

      const res = await API('master.facilityConventional.syndicationInformationOtherSave', {
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },

      );

      return res.data?.data;
    },
    onError: (error: any) => {
      console.error('=== MUTATION ERROR ===', error);
      onError?.(error);
    },
    onSuccess: (data, variables, context) => {
      console.log('=== SUCCESS ===', data);
      queryClient.invalidateQueries({ queryKey: ['syariah-child-limit-syndication']});
      onSuccess?.(data, variables, context);
    },
  });
  return query;
};
export default useSaveSyndicationTabOther;
