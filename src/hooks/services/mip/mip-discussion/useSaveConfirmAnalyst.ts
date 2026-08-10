import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveConfirmAnalyst = ({
  onSuccess = (variables) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Save Confirm Analyst with payload:', payload);
        const requestPayload: Record<string, any> = {
          analystId: payload.analystId,
          bucketMasterId: payload.bucketMasterId,
          bucketProcessId: payload.bucketProcessId,
          isAnalystConfirm: payload.isAnalystConfirm,
          isPemda: payload.isPemda,
          module: payload.module,
          process: payload.process,
        };

        if (typeof payload.action !== 'undefined') {
          requestPayload.action = payload.action;
        }

        if (typeof payload.comment !== 'undefined') {
          requestPayload.comment = payload.comment;
        }

        const response = await API('mip.mipDiscussion.saveConfirmAnalyst', {
          data: requestPayload,
        });
        console.log('API response:', response);
        return response.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: (_data, variables) => {
      // invalidate data terkait kalau dibutuhkan
      queryClient.invalidateQueries({ queryKey: ['confirm-analyst']});
      queryClient.invalidateQueries({ queryKey: ['documents']});
      queryClient.invalidateQueries({ queryKey: ['document-discussion-staff-list']});
      onSuccess(variables);
    },
  });

  return mutation;
};

export default useSaveConfirmAnalyst;
