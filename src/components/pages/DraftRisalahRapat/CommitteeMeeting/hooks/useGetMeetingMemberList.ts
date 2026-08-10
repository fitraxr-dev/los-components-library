import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RisalahRapatCommitteeMeetingInformationControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/agreement-service';


const api = new RisalahRapatCommitteeMeetingInformationControllerApi();

const useGetMeetingMemberList = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    enabled: !!payload.bucketProcessId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListMeetingMember(payload);

      return res.data?.data;
    },
    queryKey: ['meeting-member-list', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetMeetingMemberList;
