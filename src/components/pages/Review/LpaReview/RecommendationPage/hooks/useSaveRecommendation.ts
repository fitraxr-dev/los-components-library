import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RecommendationControllerApi } from '@/services/openapi/lpa-service';


const api = new RecommendationControllerApi();

interface SaveRecommendationPayload {
  bucketProcessId: string; process: string; module: string; description?: any;
}

const useSaveRecommendation = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveRecommendationPayload) => {
      const { bucketProcessId, process, module, description } = payload;
      const res = await api.saveOthers(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendation']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveRecommendation;
