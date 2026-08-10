import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MonitoringAnalysisFundedProjectControllerApi } from '@/services/openapi/mip-service';


const api = new MonitoringAnalysisFundedProjectControllerApi();

const useSaveFundedProjectMonitoring = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveDto) => {
      const {
        bucketProcessId,
        process,
        module,
        description,
      } = payload;

      const res = await api.saveMonitoringAnalysisFundedProject(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['mip-funded-project-monitoring', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};

type SaveDto = {
  bucketProcessId: string;
  process: string;
  module: string;
  description?: any;
}

export default useSaveFundedProjectMonitoring;
