import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveFinancingFacility = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const mutation = useMutation<any, Error, any>({
    mutationFn: async (payload: any) => {
      try {
        console.log('Saving financing facility with payload:', payload);
        const res = await API('mip.financingFacility.save', {
          data: payload,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('API response:', res);
        return res.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveFinancingFacility;
