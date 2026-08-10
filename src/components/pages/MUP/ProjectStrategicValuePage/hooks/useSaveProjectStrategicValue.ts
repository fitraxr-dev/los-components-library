import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProjectStrategicValueControllerApi } from '@/services/openapi/mip-service';

// TODO
const api = new ProjectStrategicValueControllerApi();

const useSaveProjectStrategicValue = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      bucketProcessId,
      process,
      module,
      description,
    }: SaveDto) => {
      // TODO
      const res = await api.saveProjectStrategicValue(
        bucketProcessId,
        process,
        module,
        description,
      );

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({
        queryKey: ['project-strategic-detail',
          {
            bucketProcessId: variable.bucketProcessId,
            module: variable.module,
            process: variable.process,
          }],
      });
      onSuccess();
    },
  });

  return mutation;
};

type SaveDto = {
  bucketProcessId: string;
  process: string;
  module: string;
  description?: Blob;
}

export default useSaveProjectStrategicValue;
