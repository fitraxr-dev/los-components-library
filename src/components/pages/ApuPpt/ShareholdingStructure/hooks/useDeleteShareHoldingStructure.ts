import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ShareholderStructureControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new ShareholderStructureControllerApi();


const useDeleteShareHoldingStructure = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteShareholderStructure(payload);

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


export default useDeleteShareHoldingStructure;
