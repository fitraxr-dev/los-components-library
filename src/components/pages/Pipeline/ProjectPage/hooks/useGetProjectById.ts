import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ProjectControllerApi } from '@/services/openapi/bucket-service';

import type { SaveProjectRequestDto } from '@/services/openapi/bucket-service';


const api = new ProjectControllerApi();

const useGetProjectById = (payload: SaveProjectRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.detailProjectBucket(payload);

      return res.data;
    },
    queryKey: ['project-detail', payload],
    select: (data) => data.data.content,
  });

  return query;
};

export default useGetProjectById;
