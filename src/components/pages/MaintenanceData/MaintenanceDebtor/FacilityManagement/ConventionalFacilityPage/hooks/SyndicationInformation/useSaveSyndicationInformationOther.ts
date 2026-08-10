import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveSyndicationInformationOther = ({
  onSuccess = () => { },
  onError = (error: any) => { },
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('master.facilityConventional.syndicationInformationOtherSave', {
        data: payload,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data;
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveSyndicationInformationOther;
