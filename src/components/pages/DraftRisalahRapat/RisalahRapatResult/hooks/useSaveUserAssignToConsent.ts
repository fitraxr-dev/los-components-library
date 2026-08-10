import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RisalahRapatConsentSheetControllerApi } from '@/services/openapi/agreement-service';

import type { RisalahRapatSaveConsentSheetUserRequestDto } from '@/services/openapi/agreement-service';


const api = new RisalahRapatConsentSheetControllerApi();

const useSaveUserAssignToConsent = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RisalahRapatSaveConsentSheetUserRequestDto) => {
      const res = await api.saveConsentSheetUser(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data, variable) => {

      queryClient.invalidateQueries({
        queryKey: ['user-collaboration-list'],
      });
      queryClient.invalidateQueries({
        queryKey: ['assigned-user'],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-collaboration-detail'],
      });
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveUserAssignToConsent;
