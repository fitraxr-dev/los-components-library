import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RisalahRapatCommitteeMeetingInformationControllerApi } from '@/services/openapi/agreement-service';

import type { RisalahRapatGetLeaderCommitteeMeetingInformationRequestDto } from '@/services/openapi/agreement-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new RisalahRapatCommitteeMeetingInformationControllerApi();

const useGetMeetingMemberLeader = (
  payload: RisalahRapatGetLeaderCommitteeMeetingInformationRequestDto,
  config?: Partial<UseQueryOptions<any, any, any>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getAutocompleteCommitteeMeetingMember(payload);

      return res.data?.data;
    },
    staleTime: ONE_MINUTE,
    ...config,
    queryKey: ['meeting-member-leader', payload],
  });

  return query;
};

export default useGetMeetingMemberLeader;
