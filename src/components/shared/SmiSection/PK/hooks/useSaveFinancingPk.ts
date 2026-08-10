import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FinancingFacilityControllerApi } from '@/services/openapi/agreement-service';

import type { FfMappingRequestDto } from '@/services/openapi/agreement-service';


const api = new FinancingFacilityControllerApi();

const useSaveFinancingPk = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payloads: FfMappingRequestDto | FfMappingRequestDto[]) => {
      if (Array.isArray(payloads)) {
        const results = [];
        for (const payload of payloads) {
          const res = await api.saveFinancingFacilityMapping(payload);
          results.push(res.data);
        }
        return results;
      } else {
        const res = await api.saveFinancingFacilityMapping(payloads);
        return res.data;
      }
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financing-facility-list']});
      queryClient.invalidateQueries({ queryKey: ['bucket-financing-facility']});
      queryClient.invalidateQueries({ queryKey: ['agreement-mapping-financing-facility']});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-mapping']});
      queryClient.invalidateQueries({ queryKey: ['syariah-facility-list']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveFinancingPk;
