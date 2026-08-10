import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { FinancingFacilityRequestDto } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useSaveFinancingFacility = ({
  onSuccess = () => { },
  onError = (error?: any) => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: FinancingFacilityRequestDto) => {
      const res = await api.saveFinancingFacility(payload);

      return res.data;
    },
    onError: (error: any) => {
      onError(error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-list']});
      queryClient.invalidateQueries({ queryKey: ['syariah-facility-list']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveFinancingFacility;
