import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveStandaloneProject = ({
  onSuccess = (_data: any) => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      try {
        console.log('Saving standalone bucket with payload:', payload);

        const res = await API('bucket.bucketList.standaloneSave', { data: payload });

        console.log('API response (saveStandaloneBucket):', res);

        return res?.data?.data ?? null;
      } catch (error) {
        console.error('API error (saveStandaloneBucket):', error);
        throw error;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      onSuccess(data);
    },
  });

  return mutation;
};

export default useSaveStandaloneProject;
