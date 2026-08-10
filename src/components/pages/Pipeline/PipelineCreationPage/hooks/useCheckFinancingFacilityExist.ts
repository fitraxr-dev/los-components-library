import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface CheckFinancingFacilityExistPayload {
  bucketProcessId: string;
}

const useCheckFinancingFacilityExist = ({
  onSuccess = (data?: any) => {},
  onError = (error?: any) => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: CheckFinancingFacilityExistPayload) => {
      const res = await API('bucket.bucketList.financingFacility', {
        data: payload,
      });

      return res.data;
    },
    onError: (error: any) => {
      onError(error);
    },
    onSuccess: (data: any) => {
      onSuccess(data);
    },
  });

  return mutation;
};

export default useCheckFinancingFacilityExist;
