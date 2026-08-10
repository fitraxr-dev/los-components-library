import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetDocumentDiscussionStaffList = (
  payload: any,
  config?: any
) => {
  const query = useQuery<any>({
    enabled: !!payload?.filter?.bucketProcessId && !!payload?.filter?.bucketMasterId,
    queryFn: async () => {
      const response = await API('mip.mipDiscussion.listDocsStaff', {
        data: payload,
      });
      return response.data?.data;
    },
    queryKey: ['document-discussion-staff-list', payload],
    ...config,
  });

  return query;
};

export default useGetDocumentDiscussionStaffList;
