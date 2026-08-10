import { useParams } from 'next/navigation';

import useGetGroupMembers from '../../../hooks/useGetGroupMembers';


const useGroupMember = () => {
  const { groupId }: {groupId: string} = useParams();

  const { data, isLoading } = useGetGroupMembers({
    filter: {
      groupId,
    },
    page: {
      itemPerPage: 5,
      noPage: 1,
    },
  });

  return {
    data,
    isLoading,
  };
};

export default useGroupMember;
