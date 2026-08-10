import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { DebtorInformationDataRequestDto } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();


const useSaveDebtorDetail = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: DebtorInformationDataRequestDto) => {
      const res = await api.saveBucketDebtor(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['debtor-detail']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveDebtorDetail;
