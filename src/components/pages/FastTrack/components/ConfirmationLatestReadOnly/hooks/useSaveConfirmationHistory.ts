import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface ConfirmationHistoryRequestDto {
  id?: number;
  bucketProcessId?: string;
  process?: string;
  module?: string;
  isConfirmed?: boolean;
  selectedResponse?: boolean;
  remark?: string;
  additionalInformation?: string;
}

const useSaveConfirmationHistory = ({
  onError = () => {},
  onSuccess = () => {},
}: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ConfirmationHistoryRequestDto) => {
      const response = await API('mip.fastTrack.saveHistory', { data: payload });
      return response.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confirmation-history-latests']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveConfirmationHistory;
