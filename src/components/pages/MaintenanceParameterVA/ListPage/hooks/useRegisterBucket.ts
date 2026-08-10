import { useMutation } from '@tanstack/react-query';


import { API } from '@/helpers/api';


interface RegisterBucketParams {
  id: string;
}

const useRegisterBucket = () => {
  return useMutation({
    mutationFn: async (params: RegisterBucketParams) => {
      const payload = {
        id: parseInt(params.id), // Convert string to number as required by the endpoint
      };

      const response = await API('parameter.paramVa.registerWorkflow', {
        data: payload,
      });
      return response;
    },
  });
};

export default useRegisterBucket;
