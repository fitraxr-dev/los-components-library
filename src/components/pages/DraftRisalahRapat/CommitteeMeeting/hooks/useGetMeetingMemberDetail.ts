import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RisalahRapatCommitteeMeetingInformationControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByIdDtoLong } from '@/services/openapi/agreement-service';


const api = new RisalahRapatCommitteeMeetingInformationControllerApi();

const useGetMeetingMemberDetail = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    enabled: !!payload.id,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDetailMeetingMember(payload);

      return res.data?.data?.content;
    },
    queryKey: ['meeting-member-detail', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetMeetingMemberDetail;
