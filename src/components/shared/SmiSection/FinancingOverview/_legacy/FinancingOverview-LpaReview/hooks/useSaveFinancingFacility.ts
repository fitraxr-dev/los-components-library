import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FinancingFacilityOverviewControllerApi } from '@/services/openapi/lpa-service';


const api = new FinancingFacilityOverviewControllerApi() ;

interface UseSaveFinancingFacilityProps {
  bucketProcessId: string; process: string; module: string; id?: number; remark?: string; description?: any;
}

const useSaveFinancingOverview = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: UseSaveFinancingFacilityProps) => {
      const { bucketProcessId, process, module, id, remark, description } = payload;
      const res = await api.saveFinancingFacilityOverview(bucketProcessId, process, module, id, remark, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financing-overview']});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-list']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveFinancingOverview;
