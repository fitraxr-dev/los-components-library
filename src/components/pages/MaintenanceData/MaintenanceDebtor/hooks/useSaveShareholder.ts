import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ShareholderControllerApi } from '@/services/openapi/bucket-service';

import type { ShareholderSaveRequestDto } from '@/services/openapi/bucket-service';


const api = new ShareholderControllerApi();

const useSaveShareholder = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ShareholderSaveRequestDto) => {
      const res = await api.saveShareholder(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['shareholders']});
    },
  });

  return mutation;
};

export default useSaveShareholder;
