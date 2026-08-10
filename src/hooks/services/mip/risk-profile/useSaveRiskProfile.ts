import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveRiskProfile = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Calling API saveRiskProfile with payload:', payload);
        const response = await API('mip.riskProfile.save', {
          data: payload,
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log('API response (saveRiskProfile):', response);
        return response?.data;
      } catch (error) {
        console.error('API error (saveRiskProfile):', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['risk-profile-detail']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveRiskProfile;
