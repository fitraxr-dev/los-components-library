import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';
import useIdentity from '@/hooks/useIdentity';


interface UseGetAuditTrailLogParams {
  noPage: number;
  itemPerPage: number;
}

const useGetAuditTrailLog = ({ noPage, itemPerPage }: UseGetAuditTrailLogParams) => {
  const { processId, bucketProcessId } = useIdentity();
  const id = processId ?? bucketProcessId;

  const query = useQuery({
    enabled: !!id,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucketDocument.fastTrack.auditTrailList', {
        data: {
          bucketProcessId: String(id),
          module: 'FAST_TRACK',
          process: 'FAST_TRACK',
        },
      });
      return res.data;
    },
    queryKey: [
      'fast-track',
      'audit-trail-log',
      id,
      noPage,
      itemPerPage,
    ],
    select: (res) => res?.data?.content ?? [],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetAuditTrailLog;
