import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ExecutiveOverviewControllerApi } from '@/services/openapi/mip-service';


const api = new ExecutiveOverviewControllerApi();

const useExecutiveSummarySave = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: PartialSaveExecutiveSummary) => {
      const { bucketProcessId, process, module, description } = payload;
      const res = await api.saveExecutiveOverview(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['executive-summary-save']});
      onSuccess();
    },
  });

  return mutation;
};

type PartialSaveExecutiveSummary = {
  bucketProcessId: string;
  process: string;
  module: string;
  description?: any;
};


export default useExecutiveSummarySave;
