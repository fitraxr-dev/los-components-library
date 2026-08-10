import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MaintenanceOtherRelatedPartiesControllerApi } from '@/services/openapi/master-service';

import type { DetailOtherRelatedPartiesRequestDto } from '@/services/openapi/master-service';


const api = new MaintenanceOtherRelatedPartiesControllerApi();

const useDeleteOtherRelatedById = ({
  onSuccess = (data) => {},
  onError = (data) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: DetailOtherRelatedPartiesRequestDto) => {
      const res = await api.deleteMaintenanceOtherRelatedParties(payload);

      return res.data.data.content;
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ['other-related-list']});
    },
  });

  return mutation;
};

export default useDeleteOtherRelatedById;
