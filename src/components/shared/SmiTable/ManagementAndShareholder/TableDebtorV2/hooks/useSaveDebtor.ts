import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { TypeModule } from '@/enums/Module';
import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';
import { ResultControllerApi } from '@/services/openapi/credit-checking-service';


const result = new ResultControllerApi();
const bucket = new ApplicationDebtorControllerApi();

const useSaveDebtor = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload, module }: saveManagementProp) => {
      let res;
      if (module === TypeModule.CREDIT_CHECKING) {
        res = await result.updateDataDebtor(payload);
        return res.data;
      } else if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
        res = await bucket.saveDebtor(payload);
        return res.data;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['debtor']});
    },
  });

  return mutation;
};

type saveManagementProp = {
  payload: any ;
  module: string;
}
export default useSaveDebtor;
