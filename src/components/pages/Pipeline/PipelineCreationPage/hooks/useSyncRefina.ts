import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PipelineControllerApi } from '@/services/openapi/bucket-service';

import type { RefinaSyncRequestDto } from '@/services/openapi/bucket-service';


const api = new PipelineControllerApi();


const useSyncRefina = ({
  onError = () => { },
  onSuccess = () => { },
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RefinaSyncRequestDto) => {
      const res = await api.syncRefina(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pipeline']});
      queryClient.invalidateQueries({ queryKey: ['stepper']});
      queryClient.invalidateQueries({ queryKey: ['detail-bucket-debtor']});
      // Add this line to invalidate financing facility queries
      queryClient.invalidateQueries({
        exact: false,
        queryKey: ['financing-facilities'],
      });
      onSuccess();
    },
  });

};

export default useSyncRefina;
