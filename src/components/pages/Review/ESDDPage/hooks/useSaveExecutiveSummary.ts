import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ExecutiveSummaryControllerApi } from '@/services/openapi/mip-service';


const api = new ExecutiveSummaryControllerApi();

const useSaveExecutiveSummary = ({
  onSuccess = (_data?: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ExecutiveSummaryPayload) => {
      const { bucketProcessId, process, module, description } = payload;
      const res = await api.saveExecutiveSummary(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['detail-executive-summary']});
      onSuccess(data);
    },
  });

  return mutation;
};

type ExecutiveSummaryPayload = {
  bucketProcessId: string;
  process: string;
  module: string;
  description?: any;
};

export default useSaveExecutiveSummary;
