import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FinancingFacilityOverviewControllerApi } from '@/services/openapi/mip-service';


const api = new FinancingFacilityOverviewControllerApi();

const useSaveFinancingFacilityDescription = ({
  onSuccess = (_data?: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveFinancingFacilityDTO) => {
      const { bucketProcessId, process, module, id, remark, description } = payload;
      const res = await api.saveFinancingFacilityOverview(bucketProcessId, process, module, id, remark, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['financing-overview']});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-list']});
      onSuccess(data);
    },
  });

  return mutation;
};

type SaveFinancingFacilityDTO = {
  bucketProcessId: string;
  process: string;
  module: string;
  id?: number;
  remark?: string;
  description?: any;
}
export default useSaveFinancingFacilityDescription;
