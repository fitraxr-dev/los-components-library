import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ManagementControllerApi } from '@/services/openapi/bucket-service';

import type { SaveManagementRequestDto } from '@/services/openapi/bucket-service';


const api = new ManagementControllerApi();

const useSaveManagement = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload, noPage, itemPerPage }: saveManagementProp) => {
      const res = await api.saveManagement(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['managements']});
      queryClient.invalidateQueries({ queryKey: ['management-detail']});
    },
  });

  return mutation;
};

type saveManagementProp = {
  payload: SaveManagementRequestDto;
  noPage: number;
  itemPerPage: number;
}
export default useSaveManagement;
