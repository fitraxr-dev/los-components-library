import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreditCheckingExternalControllerApi } from '@/services/openapi/mip-service';

import type { CreditCheckingRemarkRequestDto } from '@/services/openapi/mip-service';


const api = new CreditCheckingExternalControllerApi();

const useSaveCreditCheckingShareholdertRemark = ({
  onSuccess = (data) => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: CreditCheckingRemarkRequestDto) => {
      const res = await api.saveCreditCheckingShareholderRemark(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      onSuccess(variables);
    },
  });

  return mutation;
};

export default useSaveCreditCheckingShareholdertRemark;
