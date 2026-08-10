import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveMappingFacility = ({
  onSuccess = () => {},
  onError = (error?: any) => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('agreement.financingFacilityMapping.save', { data: payload });

      return res.data;
    },
    onError: (error: any) => {
      onError(error);
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveMappingFacility;
