import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CollateralControllerApi } from '@/services/openapi/lpa-service';


const api = new CollateralControllerApi();

const useSaveNewCollateral = ({
  onSuccess = (data: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RegisterCollateralPayload) => {
      const { bucketProcessId, module, process, parentId, type } = payload;

      const res = await api.saveCollateral(bucketProcessId, module, process, parentId, type);

      return res.data.data.content;
    },
    onError: (data) => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['collateral-list']});
      onSuccess(data.id);
    },
  });

  return mutation;
};

type RegisterCollateralPayload = {
  bucketProcessId: string;
  module: string;
  process: string;
  parentId: string;
  type: string;
};


export default useSaveNewCollateral;
