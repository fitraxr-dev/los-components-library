import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RisalahRapatConsentSheetControllerApi } from '@/services/openapi/agreement-service';

import type { RisalahRapatAssignConsentSheetUserRequestDto } from '@/services/openapi/agreement-service';


const api = new RisalahRapatConsentSheetControllerApi();

const useSaveUserAssignedCollaboration = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RisalahRapatAssignConsentSheetUserRequestDto) => {
      const res = await api.assignConsentSheetUser(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data, variable) => {
      queryClient.invalidateQueries({
        queryKey: ['user-collaboration-list']});
      queryClient.invalidateQueries({
        queryKey: ['assigned-user']});

      onSuccess();
    },
  });

  return mutation;
};

export default useSaveUserAssignedCollaboration;
