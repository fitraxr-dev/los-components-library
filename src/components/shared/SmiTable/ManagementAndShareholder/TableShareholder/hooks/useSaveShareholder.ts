import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { TypeModule } from '@/enums/Module';
import { ShareholderControllerApi } from '@/services/openapi/bucket-service';
import { ResultControllerApi } from '@/services/openapi/credit-checking-service';
import { ShareholderControllerApi as MasterShareholderControllerApi } from '@/services/openapi/master-service';


import type { ShareholderSaveRequestDto } from '@/services/openapi/master-service';


const master = new MasterShareholderControllerApi();
const bucket = new ShareholderControllerApi();
const result = new ResultControllerApi();
const useSaveShareholder = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload, module }: saveShareholderProps) => {

      switch (module) {
        case TypeModule.CREDIT_CHECKING:
          return await result.updateDataShareholder(payload);
        case MAINTENANCE_MODULE.MAINTENANCE_DEBTOR:
          return await bucket.saveShareholder(payload);
        default:
          return await master.saveShareholder(payload);
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['shareholders']});
    },
  });

  return mutation;
};

type saveShareholderProps = {
  payload: ShareholderSaveRequestDto;
  module: string;
}
export default useSaveShareholder;
