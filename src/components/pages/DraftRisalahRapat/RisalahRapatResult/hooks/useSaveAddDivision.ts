import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RisalahRapatVerificationResultControllerApi } from '@/services/openapi/agreement-service';

import type { RisalahRapatSaveUserCollaborationDivisionRequestDto } from '@/services/openapi/agreement-service';


const api = new RisalahRapatVerificationResultControllerApi();

const useSaveAddDivision = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RisalahRapatSaveUserCollaborationDivisionRequestDto) => {
      const res = await api.saveUserCollaborationDivision(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({
        queryKey: ['division-collaboration-list',
          {
            bucketProcessId: variable.bucketProcessId,
            module: variable.module,
            process: variable.process,
          }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveAddDivision;
