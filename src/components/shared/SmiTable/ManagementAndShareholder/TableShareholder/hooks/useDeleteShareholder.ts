import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MAINTENANCE_MODULE } from '@/configs/constants/maintenance';
import { ShareholderControllerApi } from '@/services/openapi/bucket-service';
import { ShareholderControllerApi as MasterShareholderControllerApi } from '@/services/openapi/master-service';


type useDeleteShareholderVariables = {
  debtorId: string;
  payload: any;
  module?: string;
};

const master = new MasterShareholderControllerApi();
const bucket = new ShareholderControllerApi();

const useDeleteShareholder = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload, module }: useDeleteShareholderVariables) => {
      let res;
      if (module === MAINTENANCE_MODULE.MAINTENANCE_DEBTOR) {
        res = await bucket.deleteShareholderById(payload);
        return res.data;
      } else {
        const res = await master.deleteShareholderById(payload);

        return res.data;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['shareholders']});
      queryClient.invalidateQueries({ queryKey: ['shareholder']});
    },
  });

  return mutation;
};


export default useDeleteShareholder;
