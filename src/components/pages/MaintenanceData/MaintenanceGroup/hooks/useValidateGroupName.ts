import { useMutation } from '@tanstack/react-query';


import { API } from '@/helpers/api';


export interface PayloadValidateGroup {
  groupCode: string;
  name: string;
}

const useValidateGroupName = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables?: any, context?: any) => void;
  onError?: (error: any) => void;
}) => {
  const query = useMutation({
    mutationFn: async (payload: PayloadValidateGroup) => {
      console.log('=== VALIDATING GROUP NAME ===', payload);
      try {
        const res = await API('maintenanceGroup.group.validateGroup', {
          data: payload,
        });
        console.log('=== API RESPONSE ===', res);
        return res.data?.data;
      } catch (error) {
        console.error('=== API ERROR ===', error);
        throw error;
      }
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
