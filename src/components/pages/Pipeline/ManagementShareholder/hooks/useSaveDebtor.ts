import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';


const api = new ApplicationDebtorControllerApi();

const useSaveDebtor = ({
  onSuccess = () => { },
  onError = (_err?: any) => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: {
      debtorId?: string;
      bucketProcessId?: string;
      process?: string;
      module?: string;
      npwp?: string;
      remark?: string;
      npwpFile?: any;

    }) => {
      const res = await api.saveCustomerDebtor(
        payload.debtorId,
        payload.bucketProcessId,
        payload.process,
        payload.module,
        payload.npwp,
        payload.remark,
        payload.npwpFile
      );

      return res.data;
    },
    onError: (err) => {
      onError(err as any);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['debtor']});
      queryClient.invalidateQueries({ queryKey: ['pipeline']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveDebtor;
