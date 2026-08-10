import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CustomerManagementControllerApi } from '@/services/openapi/bucket-service';


const api = new CustomerManagementControllerApi();

const useSaveManagement = ({
  onSuccess = () => { },
  onError = (_err?: any) => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.addOrUpdateCustomerManagement(
        payload.bucketProcessId,
        payload.process,
        payload.module,
        payload.id,
        payload.managementCode,
        payload.name,
        payload.jobPosition,
        payload.npwp,
        payload.npwpFile,
        payload.identityTypeKey,
        payload.identityDocNumber,
        payload.identityDocFile,
        payload.dob,
      );

      return res.data;
    },
    onError: (err) => {
      onError(err as any);
    },
    onSuccess: () => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['management-list']});
    },
  });

  return mutation;
};

export default useSaveManagement;
