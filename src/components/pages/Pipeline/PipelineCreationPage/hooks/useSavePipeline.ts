import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PipelineControllerApi } from '@/services/openapi/bucket-service';

import type { PipelineCreationDto } from '@/services/openapi/bucket-service';


const api = new PipelineControllerApi();

const useSavePipeline = ({
  onSuccess = (_) => {},
  onError = (err) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: PipelineCreationDto) => {

      const res = await api.savePipeline(payload);

      return res.data;
    },
    onError: (err) => {
      onError(err);
    },
    onSuccess: async (data, variable) => {
      await queryClient.invalidateQueries({ queryKey: ['bucket-list']});
      await queryClient.invalidateQueries({ queryKey: ['detail-bucket-debtor']});
      await queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      await queryClient.invalidateQueries({ queryKey: ['pipeline']});
      await queryClient.invalidateQueries({ queryKey: ['timeline', { id: variable.pipeline.analystId }]});
      onSuccess(data);
    },
  });

  return mutation;
};

export default useSavePipeline;
