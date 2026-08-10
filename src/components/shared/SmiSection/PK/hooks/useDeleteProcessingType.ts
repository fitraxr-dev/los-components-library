import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PkProcessingTypeControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByIdDtoLong } from '@/services/openapi/agreement-service';


const api = new PkProcessingTypeControllerApi();


const useDeleteProcessingType = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteProcessingType(payload);

      return res.data.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['pk-processing-type-list']});
    },
  });

  return mutation;
};


export default useDeleteProcessingType;
