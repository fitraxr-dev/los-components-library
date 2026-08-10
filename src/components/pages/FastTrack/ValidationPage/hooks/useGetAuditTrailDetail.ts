import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface UseGetAuditTrailDetailParams {
  logId: number | string;
  enabled?: boolean;
}

const useGetAuditTrailDetail = ({ logId, enabled = true }: UseGetAuditTrailDetailParams) => {

  const query = useQuery({
    enabled: !!logId && enabled,
    queryFn: async () => {
      const res = await API('bucketDocument.fastTrack.auditTrailDetail', {
        data: {
          logId: Number(logId),
        },
      });
      return res.data;
    },
    queryKey: [
      'fast-track',
      'audit-trail-detail',
      logId,
    ],
    select: (res) => res?.data?.content ?? null,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetAuditTrailDetail;
