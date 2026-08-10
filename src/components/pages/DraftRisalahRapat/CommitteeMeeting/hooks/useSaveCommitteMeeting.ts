import { databaseNotOpen } from '@azure/msal-browser/dist/error/BrowserAuthErrorCodes';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RisalahRapatCommitteeMeetingInformationControllerApi } from '@/services/openapi/agreement-service';

import type {
  RisalahRapatCommitteeMeetingInformationRequestDto,
  RisalahRapatCommitteeMeetingInformationResponseDto,
} from '@/services/openapi/agreement-service';
import type { UseMutationOptions } from '@tanstack/react-query';


const api = new RisalahRapatCommitteeMeetingInformationControllerApi();

type UseSaveCommitteeMeetingDetailProps =
  UseMutationOptions<
  RisalahRapatCommitteeMeetingInformationResponseDto,
  Error,
  RisalahRapatCommitteeMeetingInformationRequestDto
  >

const useSaveCommitteMeeting = ({ onSuccess, ...config }: UseSaveCommitteeMeetingDetailProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RisalahRapatCommitteeMeetingInformationRequestDto) => {
      const res = await api.saveCommitteeMeetingInformation(payload);

      return res.data?.data?.content;
    },
    onSuccess: (data, variables, ctx) => {
      queryClient.invalidateQueries({ queryKey: ['receiver-member']});
      queryClient.invalidateQueries({ queryKey: ['meeting-detail']});
      onSuccess?.(data, variables, ctx);
    },
    ...config,
  });

  return mutation;
};

export default useSaveCommitteMeeting;
