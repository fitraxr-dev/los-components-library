import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PurposeAndBackgroundControllerApi } from '@/services/openapi/lpa-service';
import { EsddReportControllerApi, PeerComparisonControllerApi } from '@/services/openapi/mip-service';


const api = new PurposeAndBackgroundControllerApi();

const useSavePurposeAndBackground = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SavePurposeAndBackgroundPayload) => {
      const { bucketProcessId, process, module, purpose, background } = payload;
      const res = await api.savePurposeAndBackground(bucketProcessId, process, module, purpose, background);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['peer-and-comparison']});
      onSuccess();
    },
  });

  return mutation;
};

type SavePurposeAndBackgroundPayload = {
  bucketProcessId: string;
  process: string;
  module: string;
  background?: any;
  purpose?: any;
};

export default useSavePurposeAndBackground;
