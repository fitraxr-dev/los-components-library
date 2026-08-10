import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { ProjectV2ControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoRequestByIdDtoString } from '@/services/openapi/master-service';


const api = new ProjectV2ControllerApi();

export const useGetAllMember = (
  payload: GenericBucketRequestDtoRequestByIdDtoString,
) => {
  const query = useQuery(
    {
      enabled: !!payload?.filter?.id && (
        payload?.searchDetail?.value?.length >= 3 ||
        payload?.searchDetail?.value === '' ||
        !payload?.searchDetail?.value
      ),
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getAllMemberForMaintenanceProject(payload);
        return res?.data;
      },
      queryKey: [
        'all-member-list',
        payload
      ],
    }
  );

  return query;
};
