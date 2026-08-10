import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SpecialApprovalTypeControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new SpecialApprovalTypeControllerApi();

const useDeleteSpecialApproval = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteSpecialApprovalType(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-approval']});
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteSpecialApproval;
