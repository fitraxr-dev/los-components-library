import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface CreditCheckingRemarkRequestDto {
  bucketProcessId: string;
  remark?: string;
  process: string;
  module: string;
}

const useSaveManagementRemark = ({
  onSuccess = (data) => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: CreditCheckingRemarkRequestDto) => {
      const res = await API('mip.creditChecking.creditCheckingManagementRemarkSave', {
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

export default useSaveManagementRemark;
