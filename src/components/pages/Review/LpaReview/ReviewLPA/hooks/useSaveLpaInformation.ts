import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveLpaInformation = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await API('lpa.lpaInformation.save', {
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lpa-list']});
      queryClient.invalidateQueries({ queryKey: ['documents']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveLpaInformation;
