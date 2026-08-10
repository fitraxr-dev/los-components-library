import { useMutation } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';


import type { FinancingFacilityRequestDto } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useSaveFinancingFacility = ({
  onSuccess = () => {},
  onError = (error?: any) => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: FinancingFacilityRequestDto) => {
      const res = await api.saveFinancingFacility(payload);

      return res.data;
    },
    onError: (error: any) => {
      onError(error);
    },
    onSuccess: () => {
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveFinancingFacility;
