import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';

import type { SaveSelectedBucketRequestDto } from '@/services/openapi/bucket-service';


const api = new ApplicationDebtorControllerApi();


const useSaveBusinessGroup = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveSelectedBucketRequestDto) => {
      const res = await api.saveDebtorGroupSelected(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['debtor-group-selected-list'],
      });

      onSuccess();
    },
  });

  return mutation;
};

export default useSaveBusinessGroup;
