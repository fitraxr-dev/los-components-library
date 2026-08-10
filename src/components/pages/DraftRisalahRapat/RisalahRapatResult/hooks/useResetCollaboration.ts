import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RisalahRapatVerificationResultControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/processor-service';


const api = new RisalahRapatVerificationResultControllerApi();

const useResetCollaboration = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: RequestByProcessIdDtoString) => {
      const res = await api.resetUserCollaborationStatus(payload);

      //TODO: Improve later
      setTimeout(() => {
        return res.data;
      }, 5000);
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      onSuccess();
    },

  });

  return mutation;
};


export default useResetCollaboration;
