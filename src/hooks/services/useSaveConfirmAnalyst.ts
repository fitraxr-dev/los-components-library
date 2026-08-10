import { useMutation } from '@tanstack/react-query';

import { MipDiscussionControllerApi } from '@/services/openapi/mip-service';

import type { FileUploadRequest } from '@/services/openapi/mip-service';


type SaveConfirmAnalystProps = {
  onSuccess?: () => void;
  onError?: () => void;
}

const api = new MipDiscussionControllerApi();

const useSaveConfirmAnalyst = ({
  onSuccess = () => { },
  onError = () => { },
}: SaveConfirmAnalystProps) => {
  const mutation = useMutation({
    mutationFn: async (payload: FileUploadRequest) => {
      const res = await api.confirmDocsMipDiscussionByAnalyst({
        action: payload.action,
        analystId: payload.analystId,
        bucketMasterId: payload.bucketMasterId,
        bucketProcessId: payload.bucketProcessId,
        comment: payload.comment,
        isAnalystConfirm: payload.isAnalystConfirm,
        isPemda: payload.isPemda,
        module: payload.module,
        process: payload.process,
      });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveConfirmAnalyst;
