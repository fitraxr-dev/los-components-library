import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';
import { FinancingFacilityOverviewControllerApi } from '@/services/openapi/mip-service';


const api = new FinancingFacilityOverviewControllerApi();
const api_bucket = new BucketControllerApi();


const useSaveFinancingOverview = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveFinancingPartial) => {
      const {
        bucketProcessId,
        process,
        module,
        description,
        remarks,
        typeFinancing,
        typeProcess,
        typeSubmission,
        remark,
        id,
      } = payload;
      const payloadBucket = {
        bucketProcessId,
        module,
        process,
        remarks,
        typeFinancing,
        typeProcess,
        typeSubmission,
      };
      await api.saveFinancingFacilityOverview(bucketProcessId, process, module, id, remark, description);
      await api_bucket.saveBucketDetail(payloadBucket);
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financing-overview']});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-list']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveFinancingOverview;

type SaveFinancingPartial = {
  bucketProcessId: string;
  process: string;
  module: string;
  description?: any;
  remarks?: string;
  typeFinancing?: string;
  typeProcess?: string;
  typeSubmission?: string;
  id?: number;
  remark?: string;
}
