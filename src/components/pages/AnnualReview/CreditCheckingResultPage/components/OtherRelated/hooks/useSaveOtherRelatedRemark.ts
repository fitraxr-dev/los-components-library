import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';
import { CreditCheckingExternalControllerApi } from '@/services/openapi/mip-service';


interface CreditCheckingRemarkRequestDto {
  bucketProcessId: string;
  remark?: string;
  process: string;
  module: string;
}

const useSaveOtherRelatedRemark = ({
  onSuccess = (data: any) => { },
  onError = () => { },
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: CreditCheckingRemarkRequestDto) => {
      const res = await API('mip.otherRelated.save', {
        data: payload,
      });

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

export default useSaveOtherRelatedRemark;
