import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TimelineControllerApi } from '@/services/openapi/bucket-service';

import type { SaveTimelineRequestDto } from '@/services/openapi/bucket-service';


const api = new TimelineControllerApi();

const useSaveHistory = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveTimelineRequestDto) => {
      const res = await api.saveHistory(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (payload, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveHistory;
