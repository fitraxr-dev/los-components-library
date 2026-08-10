import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseMutationOptions } from '@tanstack/react-query';


type DeleteMeetingMemberPayload = {
  id: number;
  bucketProcessId?: string;
};

const useDeleteMeetingMember = ({
  onSuccess,
  ...config
}: UseMutationOptions<any, any, DeleteMeetingMemberPayload> = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DeleteMeetingMemberPayload) => {
      const res = await API('agreement.risalahRapatCommitteeMeetingInformation.delete', {
        data: { id: payload.id },
      });

      return res.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['meeting-member-list']});
      queryClient.invalidateQueries({ queryKey: ['meeting-member-leader']});

      if (variables.bucketProcessId) {
        queryClient.invalidateQueries({
          queryKey: ['receiver-member', { id: variables.bucketProcessId }],
        });
      }

      onSuccess?.(data, variables, context);
    },
    ...config,
  });

  return mutation;
};

export default useDeleteMeetingMember;
