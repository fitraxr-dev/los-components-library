import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CollateralControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByCodeAndProcessIdDto } from '@/services/openapi/lpa-service';


const api = new CollateralControllerApi();

const useDeleteCollateral = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByCodeAndProcessIdDto) => {

      const res = await api.deleteCollateral(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['collateral-list']});
      onSuccess();
    },
  });

  return mutation;
};


export default useDeleteCollateral;
