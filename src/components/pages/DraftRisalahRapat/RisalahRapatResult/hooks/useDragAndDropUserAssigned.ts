import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RisalahRapatConsentSheetControllerApi } from '@/services/openapi/agreement-service';

import type { RisalahRapatDnDConsentSheetRequestDto } from '@/services/openapi/agreement-service';


const api = new RisalahRapatConsentSheetControllerApi();

const useDragAndDropUserAssigned = ({
  onSuccess = () => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RisalahRapatDnDConsentSheetRequestDto) => {
      const res = await api.dndConsentSheetUser(payload);
      return res.data.data.content;
    },
    onError: () => {
      queryClient.invalidateQueries({
        queryKey: ['user-collaboration-list'],
      });
      queryClient.invalidateQueries({
        queryKey: ['assigned-user'],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-collaboration-detail'],
      });
      onError();
    },
    onSuccess: (data, variable) => {
      if (data === 'INVALIDATE') {
        queryClient.invalidateQueries({
          queryKey: ['user-collaboration-list'],
        });
        queryClient.invalidateQueries({
          queryKey: ['assigned-user'],
        });
        queryClient.invalidateQueries({
          queryKey: ['user-collaboration-detail'],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ['assigned-user'],
      });

      onSuccess();
    },
  });

  return mutation;
};

export default useDragAndDropUserAssigned;
