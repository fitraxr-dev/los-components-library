import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FinancingFacilityOverviewControllerApi } from '@/services/openapi/mip-service';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {
  id: number | undefined;
  bucketProcessId: string;
  remark: string;
  description: Blob;
  process: TypeProcess;
  module: TypeModule;
}

const api = new FinancingFacilityOverviewControllerApi();

const useSaveFinancingOverview = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, bucketProcessId, process, module, remark, description }: SaveDto) => {
      const res = await api.saveFinancingFacilityOverview(bucketProcessId, process, module, id, remark, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['financing-overview', { bucketProcessId: variable.bucketProcessId }]});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-validate']});
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveFinancingOverview;
