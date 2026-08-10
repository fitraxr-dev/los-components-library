import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ShareholderStructureControllerApi } from '@/services/openapi/mip-service';

import type { ShareholderStructureByLevelRequestDto } from '@/services/openapi/mip-service';


const api = new ShareholderStructureControllerApi();


const useDeleteByLevel = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: ShareholderStructureByLevelRequestDto) => {
      const res = await api.deleteAllShareholderStructureByLevel(payload);
      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apuppt-grouped-list']});
      onSuccess();
    },

  });

  return mutation;
};


export default useDeleteByLevel;
