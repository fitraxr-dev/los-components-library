import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AssumptionQualificationControllerApi } from '@/services/openapi/mip-service';


const api = new AssumptionQualificationControllerApi();

const useClarifyingAssumptionsSave = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: PartialSaveAssumptionsSummary) => {
      const { bucketProcessId, process, module, description } = payload;
      const res = await api.saveAssumptionQualification(bucketProcessId, process, module, description);

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

type PartialSaveAssumptionsSummary = {
  bucketProcessId: string;
  process: string;
  module: string;
  description?: any;
};


export default useClarifyingAssumptionsSave;
