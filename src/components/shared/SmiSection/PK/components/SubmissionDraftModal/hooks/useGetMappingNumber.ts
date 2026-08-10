import { useMutation } from '@tanstack/react-query';

import { PkProcessingTypeControllerApi } from '@/services/openapi/agreement-service';

import type { PKProcessingTypeMappingNumberRequestDto } from '@/services/openapi/agreement-service';


const api = new PkProcessingTypeControllerApi();

const useGetMappingNumber = ({
  onSuccess = (data: []) => { },
  onError = () => { },
}) => {
  const mutation = useMutation({
    mutationFn: async (payload: PKProcessingTypeMappingNumberRequestDto) => {
      const res = await api.getMappingNumber(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data: []) => {
      onSuccess(data);
    },
  });

  return mutation;
};

export default useGetMappingNumber;
