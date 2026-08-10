import { useMutation, useQueryClient } from '@tanstack/react-query';

import showNiceModalV2 from '@/helpers/showNiceModalV2';


interface AddGroupMemberPayload {
  groupCode: string;
  remark?: string;
  sector?: string;
}

const useAddGroupMember = ({
  onSuccess = () => {},
  onError = () => {},
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: AddGroupMemberPayload[]) => {
      // For now, just return success since this is a simplified version
      // In a real implementation, you would call an API endpoint
      return { data: payload, success: true };
    },
    onError: (error: any) => {
      console.error('Error adding group member:', error);
      showNiceModalV2({
        title: 'Terjadi kesalahan saat menambahkan group member',
        type: 'error',
      });
      onError();
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['group-list']});
      queryClient.invalidateQueries({ queryKey: ['debtor-group']});
      onSuccess();
    },
  });

  return mutation;
};

export default useAddGroupMember;
