import { useQuery } from '@tanstack/react-query';


import { ProjectControllerApi } from '@/services/openapi/bucket-service';

import type { StandaloneRequestProjectDto } from '@/services/openapi/bucket-service';


const api = new ProjectControllerApi();

const useGetStandaloneSaveProject = (
  payload: StandaloneRequestProjectDto,
) => {

  const query = useQuery({
    enabled: !!payload.projectId || payload.projectId !== null,
    placeholderData: {},
    queryFn: async () => {
      const res = await api.saveStandaloneProject(payload);

      return res.data.data.content;
    },
    queryKey: ['standalone-save-project', payload.projectId],
  });

  return query;
};

export default useGetStandaloneSaveProject;
