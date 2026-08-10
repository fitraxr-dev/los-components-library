import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProposeFinancingStructureControllerApi } from '@/services/openapi/mip-service';


const api = new ProposeFinancingStructureControllerApi();

const useSaveFinancingStructure = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (
      { id, bucketProcessId, process, module, title, description, financingType }: SaveDto) => {
      const res = await api.saveProposeFinancingStructure(
        bucketProcessId, process, module, id, title, description, financingType);
      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['mup-fulfillment-list']});
      onSuccess();
    },
  });

  return mutation;
};

type SaveDto = {
  bucketProcessId: string;
  process: string;
  module: string;
  id?: number;
  title?: string;
  description?: any;
  financingType?: string;

}

export default useSaveFinancingStructure;
