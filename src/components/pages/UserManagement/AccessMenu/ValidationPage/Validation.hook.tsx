'use client';
import React, { useEffect } from 'react';

import { useParams } from 'next/navigation';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';

import useGetAccessMenuDetail from '../../hooks/useGetAccessMenuDetail';


const useValidation = () => {
  const { actions, setBucketProcessIdForStepper, setIsUserDetailLoading } = useUserManagementContext();

  const { id }: {id: string} = useParams();
  const isHasProcessId = id && id.includes('UM-');
  const {
    data: accesMenuDetailData,
    isLoading: isDetailUserLoading,
  } = useGetAccessMenuDetail({ id: id });

  useEffect(() => {
    setIsUserDetailLoading(isDetailUserLoading);
  }, [isDetailUserLoading, setIsUserDetailLoading]);

  const bucketProcessId = accesMenuDetailData?.bucketProcessId;

  return {
    bucketProcessId,
    isHasProcessId,
  };
};

export default useValidation;
