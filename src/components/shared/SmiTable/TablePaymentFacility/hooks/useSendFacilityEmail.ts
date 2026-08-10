import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSendFacilityEmail = ({
  onSuccess = () => {},
  onError = (error?: any) => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('master.facility.sendEmail', { data: payload });

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

export default useSendFacilityEmail;
