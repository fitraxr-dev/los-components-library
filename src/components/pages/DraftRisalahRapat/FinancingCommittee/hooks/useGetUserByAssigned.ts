import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type { RisalahRapatListConsentSheetUserResponseDto } from '@/services/openapi/agreement-service';


type UserByAssignedRequest = {
  bucketProcessId?: string;
  module?: string;
  process?: string;
  assignedUsers?: string[];
};

const DEFAULT_ASSIGNED_USERS = ['PD/FCM', 'FCM', 'FCL/AO', 'FCM/AO'];

type AssignedUserQueryData = {
  data: RisalahRapatListConsentSheetUserResponseDto[];
  key: string;
};

const useGetUserByAssigned = (payload: UserByAssignedRequest) => {
  const { bucketProcessId, module, process, assignedUsers = DEFAULT_ASSIGNED_USERS } = payload;
  const isEnabled = Boolean(bucketProcessId && module && process);

  const query = useQuery<AssignedUserQueryData[]>({
    enabled: isEnabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      if (!isEnabled) {
        return assignedUsers.map((key) => ({ data: [], key }));
      }

      const results = await Promise.all(
        assignedUsers.map(async (assignedTo) => {
          const res = await API('agreement.risalahRapatConsentSheet.listByAssignedTo', {
            data: {
              assignedTo,
              bucketProcessId,
              module,
              process,
            },
          });

          return {
            data: res.data.data.contents ?? [],
            key: assignedTo,
          } as AssignedUserQueryData;
        })
      );

      return results;
    },
    queryKey: ['assigned-users', bucketProcessId, module, process],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetUserByAssigned;
