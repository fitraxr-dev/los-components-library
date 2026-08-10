import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CustomerShareholderControllerApi, ShareholderControllerApi } from '@/services/openapi/bucket-service';


const api = new CustomerShareholderControllerApi();


const useSaveShareholder = ({
  onSuccess = () => { },
  onError = (error?: any) => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.addOrUpdateCustomerShareholder(
        payload.bucketProcessId,
        payload.process,
        payload.module,
        payload.id,
        payload.shareholderCode,
        payload.name,
        payload.institutionType,
        payload.npwp,
        payload.npwpFile,
        payload.identityTypeKey,
        payload.identityDocNumber,
        payload.identityDocFile,
        payload.shares,
        payload.currencyValue,
        payload.value,
        payload.exchangeRate,
        payload.percentage,
        payload.jobPosition,
      );

      return res.data;
    },
    onError: (error: any) => {
      onError(error);
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['shareholders-list']});
    },
  });

  return mutation;
};

export default useSaveShareholder;
