import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RisalahRapatCommitteeMeetingInformationControllerApi } from '@/services/openapi/agreement-service';

import type { RisalahRapatMeetingMemberRequestDto } from '@/services/openapi/agreement-service';
import type { UseMutationOptions } from '@tanstack/react-query';


const api = new RisalahRapatCommitteeMeetingInformationControllerApi();

const useSaveMeetingMember = ({
  onSuccess,
  ...config
}: UseMutationOptions<any, any, RisalahRapatMeetingMemberRequestDto>) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RisalahRapatMeetingMemberRequestDto) => {
      const res = await api.saveMeetingMember(payload);

      return res.data;
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ['meeting-member-leader']});
      queryClient.invalidateQueries({ queryKey: ['meeting-member-list']});
      queryClient.invalidateQueries({ queryKey: ['receiver-member', { id: variables.bucketProcessId }]});
      queryClient.invalidateQueries({ queryKey: ['meeting-member-detail', { id: variables.id }]});
      onSuccess?.(data, variables, context);
    },
    ...config,
  });

  return mutation;
};

export default useSaveMeetingMember;
