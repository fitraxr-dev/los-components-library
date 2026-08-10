import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PkRequestControllerApi } from '@/services/openapi/agreement-service';
import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { BucketDetailRequestDto } from '@/services/openapi/bucket-service';


const api = new PkRequestControllerApi();
const api_bucket = new BucketControllerApi();


const useApplicationSave = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: PartialSaveApplication) => {
      const {
        bucketProcessId,
        process, module,
        description,
        remarks,
        typeFinancing,
        typeProcess,
        typeSubmission,
      } = payload;
      await api_bucket.saveBucketDetail({
        bucketProcessId,
        module, process,
        remarks,
        typeFinancing,
        typeProcess,
        typeSubmission,
      });
      await api.savePKRequest(bucketProcessId, process, module, description);

    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pk-application-save']});
      onSuccess();
    },
  });

  return mutation;
};

type PartialSaveApplication = BucketDetailRequestDto & {
  bucketProcessId: string;
  process: string;
  module: string;
  description?: any;
};


export default useApplicationSave;
