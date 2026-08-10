import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PkProcessingTypeControllerApi } from '@/services/openapi/agreement-service';

import type {
  BaseResponseGenericSingleDtoPKProcessingTypeResponseDto,
  PKProcessingTypeRequestDto,
} from '@/services/openapi/agreement-service';


const api = new PkProcessingTypeControllerApi();

const useSaveProcessingType = ({
  onSuccess = (res: BaseResponseGenericSingleDtoPKProcessingTypeResponseDto) => { },
  onError = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: PKProcessingTypeRequestDto) => {
      const res = await api.saveProcessingType(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-list']});
      onSuccess(data);
    },
  });

  return mutation;
};

export default useSaveProcessingType;
