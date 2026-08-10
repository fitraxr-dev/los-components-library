import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProposeFinancingStructureControllerApi } from '@/services/openapi/mip-service';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SavePayload = {
  bucketProcessId: string;
  process: TypeProcess;
  module: TypeModule;
  title?: string;
  description?: Blob;
  id?: number;
}

const api = new ProposeFinancingStructureControllerApi();

const useSaveFinancingStructureProposal = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, process, module, id, title, description }: SavePayload) => {
      const res = await api.saveProposeFinancingStructure(bucketProcessId, process, module, id, title, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['financing-structure-proposal-list', {
          filter: {
            bucketProcessId: variables.bucketProcessId,
            module: variables.module,
            process: variables.process,
          },
        }],
      });
      onSuccess();
    },
  });
  return mutation;
};

export default useSaveFinancingStructureProposal;
