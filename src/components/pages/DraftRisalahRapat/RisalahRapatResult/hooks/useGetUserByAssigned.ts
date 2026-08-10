import { keepPreviousData, useQueries } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RisalahRapatConsentSheetControllerApi } from '@/services/openapi/agreement-service';


const api = new RisalahRapatConsentSheetControllerApi();

type RisalahRapatListConsentSheetByAssignedToRequest = {
  bucketProcessId?: string;
  module?: string;
  process?: string;
};

const assignedUsers = ['PD/FCM', 'FCM', 'FCL/AO', 'FCM/AO'];

const useGetUserCollaboration = (payload: RisalahRapatListConsentSheetByAssignedToRequest) => {
  const query = useQueries({
    combine: (results) => {
      const data = results.map((result) => result.data || []);
      const isFetched = results.every((result) => result.isFetching);
      const isLoading = results.some((result) => result.isRefetching);
      return { data, isFetched, isLoading };
    },
    queries: assignedUsers.map((user) => ({
      enabled: !!payload.bucketProcessId && !!payload.module && !!payload.process,
      queryFn: async () => {
        if (!payload.bucketProcessId || !payload.module || !payload.process) {
          return { data: [], key: user };
        }

        const res = await api.listConsentSheetUserByAssignedTo({
          assignedTo: user,
          ...payload,
        });

        return { data: res.data.data.contents, key: user };
      },
      queryKey: ['assigned-user', user, payload],
    })),
  });

  return query;
};

export default useGetUserCollaboration;
