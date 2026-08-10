import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { TypeModule } from '@/enums/Module';
import { ManagementControllerApi } from '@/services/openapi/bucket-service';
import { ResultControllerApi } from '@/services/openapi/credit-checking-service';
import { ManagementControllerApi as MasterSaveManagementRequestDto } from '@/services/openapi/master-service';

import type { SaveManagementRequestDto } from '@/services/openapi/bucket-service';


const bucket = new ManagementControllerApi();
const master = new MasterSaveManagementRequestDto();
const result = new ResultControllerApi();

const useSaveManagement = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload, module }: saveManagementProp) => {
      let res;
      if (module === TypeModule.CREDIT_CHECKING) {
        res = await result.updateDataManagement(payload);
        return res.data;
      } else if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
        res = await bucket.saveManagement(payload);
        return res.data;
      } else {
        res = await master.saveManagement(payload);
        return res.data;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['managements']});
      queryClient.invalidateQueries({ queryKey: ['management-detail']});
    },
  });

  return mutation;
};

type saveManagementProp = {
  payload: SaveManagementRequestDto;
  module?: string;
}
export default useSaveManagement;
