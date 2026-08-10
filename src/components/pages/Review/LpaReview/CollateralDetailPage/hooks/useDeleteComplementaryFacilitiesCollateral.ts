import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CollateralComplementaryFacilitiesControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByCodeAndProcessIdDto } from '@/services/openapi/lpa-service';


const api = new CollateralComplementaryFacilitiesControllerApi();

const useDeleteComplementaryFacilitiesCollateral = ({
  onSuccess = (data: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByCodeAndProcessIdDto) => {
      const res = await api.deleteCollateralComplementaryFacilities(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['collateral-complementary-facilities-detail']});
      queryClient.invalidateQueries({ queryKey: ['collateral-list']});
      queryClient.invalidateQueries({ queryKey: ['complementary']});
      onSuccess(data.id);
    },
  });

  return mutation;
};

export default useDeleteComplementaryFacilitiesCollateral;
