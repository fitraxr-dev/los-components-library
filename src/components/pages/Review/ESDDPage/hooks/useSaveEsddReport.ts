import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EsddReportControllerApi } from '@/services/openapi/mip-service';


const api = new EsddReportControllerApi();

const useSaveEsddReport = ({
  onSuccess = (_data?: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: EsddReportPayload) => {
      const { bucketProcessId, process, module, description } = payload;
      const res = await api.saveEsddReport(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['detail-esdd-report']});
      onSuccess(data);
    },
  });

  return mutation;
};

type EsddReportPayload = {
  bucketProcessId: string;
  process: string;
  module: string;
  description?: any;
};

export default useSaveEsddReport;
