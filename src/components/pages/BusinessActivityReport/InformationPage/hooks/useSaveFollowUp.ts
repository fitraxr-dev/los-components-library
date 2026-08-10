import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { BarControllerApi } from '@/services/openapi/master-service';

import type { BarDiscussionFollowUpResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new BarControllerApi();

type saveFollowUpPayload = {
  bucketProcessId: string;
  process: string;
  module: string;
  discussion?: any;
  followUp?: any;
}
const useSaveFollowUp = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      bucketProcessId,
      process,
      module,
      discussion,
      followUp,
    }: saveFollowUpPayload) => {
      const res = await api.saveBarDiscussionFollowUp(
        bucketProcessId,
        process,
        module,
        discussion,
        followUp,
      );

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['follow-up-data']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveFollowUp;
