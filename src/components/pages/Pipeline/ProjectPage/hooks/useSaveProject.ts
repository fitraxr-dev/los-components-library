import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProjectControllerApi } from '@/services/openapi/bucket-service';

import type { SaveProjectRequestDto } from '@/services/openapi/bucket-service';


const api = new ProjectControllerApi();

const useSaveProject = ({
  onSuccess = () => {},
  onError = (res) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveProjectRequestDto) => {
      const res = await api.saveProjectBucket(payload);

      return res.data;
    },
    onError: (err) => {
      onError(err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-list']});
      queryClient.invalidateQueries({ queryKey: ['project']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveProject;
