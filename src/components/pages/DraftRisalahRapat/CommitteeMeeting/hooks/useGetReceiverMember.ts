import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { RisalahRapatCommitteeMeetingInformationControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/agreement-service';


const api = new RisalahRapatCommitteeMeetingInformationControllerApi();

const useGetReceiverMember = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListPoa(payload);

      return res.data?.data?.contents;
    },
    queryKey: ['receiver-member', { id: payload.bucketProcessId }],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetReceiverMember;
