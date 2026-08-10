import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ProjectControllerApi } from '@/services/openapi/bucket-service';

import type { SaveProjectRequestDto } from '@/services/openapi/bucket-service';


const api = new ProjectControllerApi();

const useDeleteProject = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveProjectRequestDto) => {
      const res = await api.deleteMappingProjectBucket(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects-list']});
      queryClient.invalidateQueries({ queryKey: ['project']});
      onSuccess();
    },
  });

  return mutation;
};


export default useDeleteProject;
