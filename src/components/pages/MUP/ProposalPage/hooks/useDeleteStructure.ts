import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProposeFinancingStructureControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new ProposeFinancingStructureControllerApi();

const useDeleteStructure = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteProposeFinancingStructure(payload);

      return res.data.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables: RequestByIdDtoLong) => {
      queryClient.invalidateQueries({ queryKey: ['mup-financing-structure']});
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteStructure;
