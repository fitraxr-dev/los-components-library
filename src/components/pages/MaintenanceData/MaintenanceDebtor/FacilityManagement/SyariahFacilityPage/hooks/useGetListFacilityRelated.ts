import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ProjectControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoRequestByIdDtoLong } from '@/services/openapi/master-service';


const api = new ProjectControllerApi();

const useGetListFacilityRelated = (payload: GenericBucketRequestDtoRequestByIdDtoLong) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.projectFacilityAll(payload);

      return res?.data?.data;
    },
    queryKey: ['project-facility-related', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};


export default useGetListFacilityRelated;
