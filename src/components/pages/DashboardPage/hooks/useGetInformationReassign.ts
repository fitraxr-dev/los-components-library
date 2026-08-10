import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface ReassignInfoPayload {
  originPicId: string | number;
}

const useGetInformationReassign = (payload: ReassignInfoPayload) => {
  const query = useQuery({
    enabled: !!payload.originPicId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.assignment.confirmationInfo', {
        data: payload,
      });

      return res.data;
    },
    queryKey: ['confirmation-info-reassign', payload],
    select: ({ data }) => data,
  });

  return query;
};

export default useGetInformationReassign;
