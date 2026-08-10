import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RisalahRapatVerificationResultControllerApi } from '@/services/openapi/agreement-service';

import { divisions } from '../RisalahRapatResult.contants';

import type { RisalahRapatSaveUserCollaborationRequestDto } from '@/services/openapi/agreement-service';


const api = new RisalahRapatVerificationResultControllerApi();

const useSaveUserAssignedDivision = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RisalahRapatSaveUserCollaborationRequestDto) => {
      const res = await api.saveUserCollaboration(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data, variable) => {
      queryClient.invalidateQueries({
        queryKey: ['division-user-list'],
      });
      queryClient.invalidateQueries({
        queryKey: ['assigned-user'],
      });
      queryClient.invalidateQueries({
        queryKey: ['assigned-user'],
      });
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveUserAssignedDivision;
