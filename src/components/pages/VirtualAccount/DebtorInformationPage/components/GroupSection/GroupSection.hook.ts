import React, { useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';


import useGetDetailCustomer from '../../../hooks/useGetDetailCustomer';
import useGetBusinessGroupList from '../../hooks/useGetBusinessGroupList';


const useGroupSection = () => {
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [debtorIdFromProcess, bucketProcessId] = processId?.split('~') ?? [];

  const { data: businessGroupListData, isLoading: businessGroupListLoading } = useGetDetailCustomer({
    id: debtorIdFromProcess,
  });

  const businessGroupListContents = businessGroupListData?.groups;

  return {
    businessGroupListContents,
    businessGroupListLoading,
    noPage,
    setNoPage,
  };
};

export default useGroupSection;
