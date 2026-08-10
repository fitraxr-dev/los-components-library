import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { ManagementControllerApi } from '@/services/openapi/bucket-service';
import { ManagementControllerApi as MasterManagementControllerApi } from '@/services/openapi/master-service';


const bucket = new ManagementControllerApi();
const master = new MasterManagementControllerApi();

const useDeleteManagement = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload, module }: deleteManagementProp) => {
      let res;
      if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
        res = await bucket.deleteManagementById(payload);

        return res.data;
      } else {
        const res = await master.deleteManagementById(payload);

        return res.data;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['managements']});
    },
  });

  return mutation;
};

type deleteManagementProp = {
  // TODO: Payload type - Adit
  payload: any;
  debtorId: string;
  module: string;
}

export default useDeleteManagement;
