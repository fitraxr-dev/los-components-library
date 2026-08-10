import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProposeFinancingStructureControllerApi } from '@/services/openapi/mip-service';

import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


type DeleteFinancingStructureProps = {
  payload: RequestByIdDtoLong;
  bucketProcessId: string;
  module: TypeModule;
  process: TypeProcess;
}

const api = new ProposeFinancingStructureControllerApi();

const useDeleteFinancingStructureProposal = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload }: DeleteFinancingStructureProps) => {
      const res = await api.deleteProposeFinancingStructure(payload);

      return res.data.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables: DeleteFinancingStructureProps) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['financing-structure-proposal-list', {
        filter: {
          bucketProcessId: variables.bucketProcessId,
          module: variables.module,
          process: variables.process,
        },
      }]});
    },
  });

  return mutation;
};

export default useDeleteFinancingStructureProposal;
