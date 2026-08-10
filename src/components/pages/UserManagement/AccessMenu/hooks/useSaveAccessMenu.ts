import { useMutation } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveAccessMenu = ({
  onError = (error: any) => {},
  onSuccess = (response, payload) => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await API('userManagement.accessMenu.save', {
        data: payload,
      });
      return res.data.data.content;
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: (response, payload) => {

      onSuccess(response, payload);
    },
  });

  return mutation;
};

export default useSaveAccessMenu;
