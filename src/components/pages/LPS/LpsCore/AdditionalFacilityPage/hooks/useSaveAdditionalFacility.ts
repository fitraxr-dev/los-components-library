import { useMutation } from '@tanstack/react-query';

import { BucketControllerApi } from '@/services/openapi/bucket-service';

import type { AdditionalFacilityRequestDto } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useSaveAdditionalFacility = ({
  onSuccess = () => {},
  onError = (error: any) => {},
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: AdditionalFacilityRequestDto) => {
      const res = await api.saveAdditionalFacility(payload);

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


export default useSaveAdditionalFacility;
