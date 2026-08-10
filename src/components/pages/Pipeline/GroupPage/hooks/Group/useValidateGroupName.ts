import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface PayloadValidateGroup {
  name: string;
}

const useValidateGroupName = ({
  onSuccess,
  onError,
}) => {
  const query = useMutation({
    mutationFn: async (payload: PayloadValidateGroup) => {
      const res = await API('pipeline.group.validateGroup', {
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
      onSuccess?.(data, variables, context);
    },
  });
  return query;
};

export default useValidateGroupName;
