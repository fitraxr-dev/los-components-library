import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ManagementControllerApi } from '@/services/openapi/master-service';

import type { DebtorDescriptionRequest } from '@/services/openapi/master-service';


const api = new ManagementControllerApi();

const useSaveManagementRemark = ({
  onSuccess = (data: any) => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: DebtorDescriptionRequest) => {
      const res = await api.saveDescriptionManagement(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['management-description']});
      onSuccess(variables);
    },
  });

  return mutation;
};

export default useSaveManagementRemark;
