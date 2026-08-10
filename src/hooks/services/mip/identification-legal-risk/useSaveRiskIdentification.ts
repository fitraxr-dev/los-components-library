import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveRiskIdentification = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling API saveIdentificationLegalRisk with payload:', payload);
        const response = await API('mip.identificationLegalRisk.save', {
          data: payload,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('API response (saveIdentificationLegalRisk):', response);
        return response?.data;
      } catch (error) {
        console.error('API error (saveIdentificationLegalRisk):', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-identification-detail']});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveRiskIdentification;
