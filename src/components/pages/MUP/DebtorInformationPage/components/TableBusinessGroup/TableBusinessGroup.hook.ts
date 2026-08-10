import { useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetBusinessGroupSelected from '@/hooks/useGetBusinessGroupSelected';
import useIdentity from '@/hooks/useIdentity';


const useTableBusinessGroup = () => {
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const { data: businessGroupListData, isLoading: businessGroupListLoading } = useGetBusinessGroupSelected({
    filter: {
      bucketProcessId: processId,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
    },
    page: {
      itemPerPage,
      noPage,
    },
  });

  const businessGroupContents = businessGroupListData?.contents?.map((item) => ({
    ...item,
    groupName: item.groupName,
    groupType: item.groupType,
  }));

  const businessGroupPage = businessGroupListData?.page;

  return {
    businessGroupContents,
    businessGroupPage,
    isBusinessGroupLoading: businessGroupListLoading,
    noPage,
    setItemPerPage,
    setNoPage };
};

export default useTableBusinessGroup;
