import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PurposeControllerApi } from '@/services/openapi/mip-service';


const api = new PurposeControllerApi();

const useSavePurposeDetail = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: purposeDetailDTO) => {
      const res = await api.savePurpose(
        payload.bucketProcessId,
        payload.module,
        payload.process,
        payload.applicationType,
        payload.remark,
        payload.description
      );

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['high-risk-purpose-detail', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      onSuccess();
    },
  });
  return mutation;
};

type purposeDetailDTO = {
  bucketProcessId: string;
  module: string;
  process: string;
  applicationType?: string;
  remark?: string;
  description?: any;
}

export default useSavePurposeDetail;
