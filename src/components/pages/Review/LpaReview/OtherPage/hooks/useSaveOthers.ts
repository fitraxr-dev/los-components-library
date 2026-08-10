import { useMutation, useQueryClient } from '@tanstack/react-query';

import { OthersControllerApi, RecommendationControllerApi } from '@/services/openapi/lpa-service';


const api = new OthersControllerApi();

interface SaveOthersPayload {
  bucketProcessId: string; process: string; module: string; description?: any;
}

const useSaveOthers = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveOthersPayload) => {
      const { bucketProcessId, process, module, description } = payload;
      const res = await api.saveOthers1(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['others']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveOthers;
