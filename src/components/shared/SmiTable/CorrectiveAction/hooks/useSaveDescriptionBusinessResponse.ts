import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CorrectiveActionPlanControllerApi } from '@/services/openapi/mip-service';

import type { CapDescriptionSaveRequestDto } from '@/services/openapi/mip-service';


const api = new CorrectiveActionPlanControllerApi();

const useSaveDescriptionBusinessResponse = ({
  onSuccess = (data: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: Array<CapDescriptionSaveRequestDto>) => {
      const res = await api.saveCapDescBusinessResponse(payload);

      return res.data.data.contents;
    },
    onError: (err) => {
      onError();
    },
    onSuccess: (data, variable) => {
      onSuccess(data);
    },
  });

  return mutation;
};

export default useSaveDescriptionBusinessResponse;
