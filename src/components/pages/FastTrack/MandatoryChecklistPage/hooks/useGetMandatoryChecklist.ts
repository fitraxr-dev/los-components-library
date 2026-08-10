import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface UseGetMandatoryChecklistParams {
  bucketProcessId?: string;
  enabled?: boolean;
  [key: string]: any;
}

const useGetMandatoryChecklist = ({ bucketProcessId, enabled = true, ...rest }: UseGetMandatoryChecklistParams) => {
  const query = useQuery({
    enabled: !!bucketProcessId && enabled,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucketDocument.fastTrack.mandatoryCheckList', {
        data: {
          bucketProcessId,
          ...rest,
        },
      });
      return res.data;
    },
    queryKey: [
      'fast-track-mandatory-checklist',
      bucketProcessId,
      rest
    ],
    select: (res) => res?.data?.content ?? [],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetMandatoryChecklist;
