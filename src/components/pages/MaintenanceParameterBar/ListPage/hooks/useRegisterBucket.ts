import { useMutation } from '@tanstack/react-query';


import { API } from '@/helpers/api';


interface RegisterBucketParams {
  id: string;
  subModule?: string;
}

const useRegisterBucket = () => {
  return useMutation({
    mutationFn: async (params: RegisterBucketParams) => {
      const payload = {
        additionalData: params.subModule || null,
        debtorId: 'DEBT-SYSTEM',
        module: 'PARAMETER_BUSINESS_CALL',
        process: 'PARAMETER_BUSINESS_CALL',
      };

      const response = await API('parameter.parameterBar.RegisterBucket', {
        data: payload,
      });
      return response;
    },
  });
};

export default useRegisterBucket;
