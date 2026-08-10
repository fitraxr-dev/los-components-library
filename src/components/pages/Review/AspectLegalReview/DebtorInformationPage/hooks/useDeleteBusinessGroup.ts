import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByIdDtoLong } from '@/services/openapi/bucket-service';


const api = new ApplicationDebtorControllerApi();


const useDeleteBusinessGroup = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteDebtorGroupSelected(payload);

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

export default useDeleteBusinessGroup;
